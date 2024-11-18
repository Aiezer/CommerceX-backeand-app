import type { HttpContext } from '@adonisjs/core/http'

import Database from '@adonisjs/lucid/services/db'
import Sale from '#models/sale'
import SaledProducts from '#models/saled_products'
import { DateTime } from 'luxon'
import { calculateTotalPrice } from '../utils/calculate_total_price.js'

export default class SalesController {
  public async store({ request, response }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const { clientId, products } = request.only(['clientId', 'products'])

      const totalPrice = await calculateTotalPrice(products)

      const sale = await Sale.create(
        {
          clientId,
          totalPrice,
          saleDate: DateTime.now(),
        },
        { client: trx }
      )

      for (const prod of products) {
        await SaledProducts.create(
          {
            saleId: sale.id,
            productId: prod.productId,
            quantity: prod.quantity,
          },
          { client: trx }
        )
      }

      await trx.commit()
      return response.status(201).json(sale)
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ error: 'Erro ao criar venda', details: error.message })
    }
  }
}
