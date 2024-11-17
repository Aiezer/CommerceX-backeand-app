import factory from '@adonisjs/lucid/factories'
import Product from '#models/product'
import { DateTime } from 'luxon'

// Factory de Product
export const ProductFactory = factory
  .define(Product, ({ faker }) => {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.float({ min: 10, max: 100 }),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
  })
  .build()