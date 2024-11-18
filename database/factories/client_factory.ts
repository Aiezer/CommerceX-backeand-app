import factory from '@adonisjs/lucid/factories'
import Client from '#models/client'
import Phone from '#models/phone'
import Address from '#models/address'
import { DateTime } from 'luxon'

export const PhoneFactory = factory
  .define(Phone, ({ faker }) => {
    return {
      number: faker.phone.number({ style: 'national' }),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
  })
  .build()

export const AddressFactory = factory
  .define(Address, ({ faker }) => {
    return {
      street: faker.location.street(),
      number: faker.number.bigInt().toString(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode('#####-###'),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
  })
  .build()

export const ClientFactory = factory
  .define(Client, ({ faker }) => {
    return {
      name: faker.internet.username(),
      cpf: faker.helpers.replaceSymbols('###########'),
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    }
  })
  .relation('phones', () => PhoneFactory)
  .relation('addresses', () => AddressFactory)
  .build()
