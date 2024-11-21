import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import Sale from '#models/sale'
import SaledProducts from '#models/saled_products'
import Product from '#models/product'
import { DateTime } from 'luxon'

export default class SalesController {
  public async store({ request, response }: HttpContext) {
    const trx = await Database.transaction()
    try {
      const { clientId, products } = request.only(['clientId', 'products'])

      const productIds = products.map((prod: SaledProducts) => prod.productId)
      const foundProducts = await Product.query()
        .whereIn('id', productIds)
        .andWhere('deleted', false)

      if (foundProducts.length !== productIds.length) {
        const missingIds = productIds.filter(
          (id: number) => !foundProducts.some((product) => product.id === id)
        )
        throw new Error(`Products with IDs ${missingIds.join(', ')} were not found`)
      }

      const saledProductsData = products.map((prod: SaledProducts) => {
        const product = foundProducts.find((p) => p.id === prod.productId)!
        return {
          productId: product.id,
          quantity: prod.quantity,
          unitPrice: product.price,
        }
      })

      const totalPrice = saledProductsData.reduce(
        (total: number, prod: SaledProducts) => total + prod.quantity * prod.unitPrice,
        0
      )
      const sale = await Sale.create(
        {
          clientId,
          totalPrice: Number(totalPrice.toFixed(2)),
          saleDate: DateTime.now(),
        },
        { client: trx }
      )

      await SaledProducts.createMany(
        saledProductsData.map((prod: SaledProducts) => ({
          saleId: sale.id,
          productId: prod.productId,
          quantity: prod.quantity,
          unitPrice: prod.unitPrice,
        })),
        { client: trx }
      )

      await trx.commit()
      return response.status(201).json(sale)
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({ error: 'Error creating sale', details: error.message })
    }
  }
}
