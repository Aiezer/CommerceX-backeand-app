import factory from '@adonisjs/lucid/factories'
import Sale from '#models/sale'
import SaledProducts from '#models/saled_products'
import Product from '#models/product'
import { DateTime } from 'luxon'
import { ClientFactory } from './client_factory.js'
import { ProductFactory } from './product_factory.js'

function calculateTotalPrice(products: Array<{ quantity: number; unitPrice: number }>): number {
  return products.reduce((total, prod) => total + prod.quantity * prod.unitPrice, 0)
}

export const SaleFactory = factory
  .define(Sale, async ({ faker }) => {
    const client = await ClientFactory.with('phones', 2).with('addresses', 2).create()

    let products = await Product.query().where('deleted', false).limit(3)
    if (products.length === 0) {
      products = await ProductFactory.createMany(3)
    }

    const saledProductsData = products.map((product) => ({
      productId: product.id,
      quantity: faker.number.int({ min: 1, max: 10 }),
      unitPrice: product.price,
    }))

    const totalPrice = calculateTotalPrice(saledProductsData)

    const sale = await Sale.create({
      clientId: client.id,
      totalPrice,
      saleDate: DateTime.now(),
    })

    await SaledProducts.createMany(
      saledProductsData.map((prod) => ({
        saleId: sale.id,
        ...prod,
      }))
    )

    return sale
  })
  .build()
