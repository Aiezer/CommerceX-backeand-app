import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
        .onDelete('CASCADE')
      table.string('street').notNullable()
      table.string('number').notNullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('zip_code').notNullable()
      table.string('complement').nullable()
      table.timestamps(true) // Cria automaticamente `createdAt` e `updatedAt`
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
