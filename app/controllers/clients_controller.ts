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
    const month = request.qs().month
    const year = request.qs().year

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
      return response.notFound({ error: 'Cliente não encontrado' })
    }

    return response.json(client)
  }

  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createClientValidator)
    const clientData = await Database.transaction(async (trx) => {
      const client = new Client()
      client.merge(payload)
      client.useTransaction(trx)
      await client.save()

      if (payload.phones) {
        const phone = new Phone()
        phone.merge({ number: payload.phones, clientId: client.id })
        phone.useTransaction(trx)
        await phone.save()
      }

      if (payload.addresses) {
        const address = new Address()
        address.merge({ ...payload.addresses, clientId: client.id })
        address.useTransaction(trx)
        await address.save()
      }

      return client
    })

    return clientData
  }

  async update({ request, params }: HttpContext) {
    const payload = await request.validateUsing(updateClientValidator)

    const clientData = await Database.transaction(async (trx) => {
      const client = await Client.findOrFail(params.id, { client: trx })
      client.merge(payload)
      client.useTransaction(trx)
      await client.save()

      if (payload.phones) {
        let phones = await Phone.findBy('clientId', client.id, { client: trx })
        if (!phones) {
          phones = new Phone()
          phones.useTransaction(trx)
        }
        phones.merge({ number: payload.phones, clientId: client.id })
        await phones.save()
      }

      if (payload.addresses) {
        let addresses = await Address.findBy('clientId', client.id, { client: trx })
        if (!addresses) {
          addresses = new Address()
          addresses.useTransaction(trx)
        }
        addresses.merge({ ...payload.addresses, clientId: client.id })
        await addresses.save()
      }

      return client
    })

    return clientData
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
        .json({ message: 'Cliente e vendas associadas excluídos com sucesso.' })
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ error: 'Erro ao excluir cliente', details: error.message })
    }
  }
}
