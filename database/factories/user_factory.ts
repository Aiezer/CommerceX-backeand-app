import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      name: faker.internet.username(),
      email: faker.internet.email(),
      password: await hash.make(faker.internet.password()),
    }
  })
  .build()
