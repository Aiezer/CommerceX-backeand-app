import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.decimal('price', 10, 2).notNullable()
      table.boolean('deleted').defaultTo(false)
      table.timestamps(true) // Cria automaticamente `createdAt` e `updatedAt`
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
