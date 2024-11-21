import { HttpContext } from '@adonisjs/core/http'
import { createClientValidator, updateClientValidator } from '#validators/client'
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
      return response.status(404).json({ error: 'Customer not found' })
    }

    return response.json(client)
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createClientValidator)

    const trx = await Database.transaction()
    try {
      const client = await this.saveClient(payload, trx)
      await trx.commit()

      return response.status(201).json(client)
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ error: 'Error creating client', details: error.message })
    }
  }

  async update({ request, params, response }: HttpContext) {
    const payload = await request.validateUsing(updateClientValidator)

    const trx = await Database.transaction()
    try {
      const client = await Client.findOrFail(params.id, { client: trx })
      client.merge(payload)

      const updatedClient = await this.saveClient(client, trx)
      await trx.commit()

      return response.status(200).json(updatedClient)
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ error: 'Error updating client', details: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const client = await Client.findOrFail(params.id, { client: trx })
      await client.related('sales').query().delete()
      await client.delete()

      await trx.commit()
      return response
        .status(200)
        .json({ message: 'Customer and associated sales successfully deleted.' })
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ error: 'Error deleting customer', details: error.message })
    }
  }

  private async saveClient(payload: any, trx: any) {
    const client = payload instanceof Client ? payload : new Client().merge(payload)
    client.useTransaction(trx)
    await client.save()

    await this.syncRelatedEntities(client, payload, trx)
    return client
  }

  /**
   * Sincroniza as entidades relacionadas (Phones e Addresses).
   */
  private async syncRelatedEntities(client: Client, payload: any, transaction: any) {
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

    if (payload.addresses) {
      const existingAddress = await Address.query().where('clientId', client.id!).first()

      const address = existingAddress || new Address()
      address.merge({ ...payload.addresses, clientId: client.id! })
      address.useTransaction(transaction)
      await address.save()
    }
  }
}
