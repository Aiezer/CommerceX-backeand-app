import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

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
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
      table.integer('quantity').unsigned().notNullable()
      table.decimal('unit_price', 10, 2).notNullable()
      table.decimal('total_price', 10, 2).notNullable()
      table.timestamp('sale_date').notNullable()
      table.timestamps(true) // Cria automaticamente `createdAt` e `updatedAt`
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
