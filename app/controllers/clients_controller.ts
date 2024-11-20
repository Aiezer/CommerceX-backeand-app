import { HttpContext } from '@adonisjs/core/http'
import { createClientValidator, updateClientValidator } from '#validators/client_validator'
import Client from '#models/client'
import Phone from '#models/phone'
import Address from '#models/address'
import Database from '@adonisjs/lucid/services/db'

export default class ClientsController {
  async index({ response }: HttpContext) {
    const clients = await Client.query().select('id', 'name', 'cpf').orderBy('id')

    return response.json(clients)
  }

  async show({ params, request, response }: HttpContext) {
    const { id } = params
    const { month, year } = request.qs()

    const client = await Client.query()
      .where('id', id)
      .preload('phones')
      .preload('addresses')
      .preload('sales', (salesQuery) => {
        if (month && year) {
          salesQuery
            .whereRaw('MONTH(sale_date) = ?', [month])
            .whereRaw('YEAR(sale_date) = ?', [year])
        }
        salesQuery.preload('saledProducts').orderBy('saleDate', 'desc')
      })
      .first()

    if (!client) {
      return response.status(404).json({ error: 'Cliente não encontrado' })
    }

    return response.json(client)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createClientValidator)

    const transaction = await Database.transaction()
    try {
      const client = await this.saveClient(payload, transaction)

      await transaction.commit()
      return response.status(201).json(client)
    } catch (error) {
      await transaction.rollback()
      return response.status(500).json({ error: 'Erro ao criar cliente', details: error.message })
    }
  }

  async update({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateClientValidator)

    const transaction = await Database.transaction()
    try {
      const client = await Client.findOrFail(params.id, { client: transaction })
      client.merge(payload)
      client.useTransaction(transaction)
      await client.save()

      await this.syncRelatedEntities(client, payload, transaction)

      await transaction.commit()
      return response.status(200).json(client)
    } catch (error) {
      await transaction.rollback()
      return response
        .status(500)
        .json({ error: 'Erro ao atualizar cliente', details: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const transaction = await Database.transaction()
    try {
      const client = await Client.findOrFail(params.id, { client: transaction })
      await client.related('sales').query().delete()
      await client.delete()

      await transaction.commit()
      return response
        .status(200)
        .json({ message: 'Cliente e vendas associadas excluídos com sucesso.' })
    } catch (error) {
      await transaction.rollback()
      return response.status(500).json({ error: 'Erro ao excluir cliente', details: error.message })
    }
  }

  /**
   * Cria ou atualiza um cliente e sincroniza as entidades relacionadas.
   */
  private async saveClient(payload: any, transaction: any) {
    const client = new Client()
    client.merge(payload)
    client.useTransaction(transaction)
    await client.save()

    await this.syncRelatedEntities(client, payload, transaction)
    return client
  }

  /**
   * Sincroniza as entidades relacionadas (Phones e Addresses).
   */
  private async syncRelatedEntities(client: Client, payload: any, transaction: any) {
    // Sincroniza telefones
    if (payload.phones) {
      const phoneNumbers = Array.isArray(payload.phones) ? payload.phones : [payload.phones]

      const existingPhones = await Phone.query()
        .where('clientId', client.id!)
        .select('id', 'number')

      const existingPhoneNumbers = existingPhones.map((phone) => phone.number)

      const phonesToAdd = phoneNumbers.filter(
        (number: string) => !existingPhoneNumbers.includes(number)
      )

      const phonesToRemove = existingPhones.filter((phone) => !phoneNumbers.includes(phone.number))

      for (const number of phonesToAdd) {
        const phone = new Phone()
        phone.merge({ number, clientId: client.id! })
        phone.useTransaction(transaction)
        await phone.save()
      }

      for (const phone of phonesToRemove) {
        phone.useTransaction(transaction)
        await phone.delete()
      }
    }

    // Sincroniza endereços
    if (payload.addresses) {
      const existingAddress = await Address.query().where('clientId', client.id!).first()

      const address = existingAddress || new Address()
      address.merge({ ...payload.addresses, clientId: client.id! })
      address.useTransaction(transaction)
      await address.save()
    }
  }
}
