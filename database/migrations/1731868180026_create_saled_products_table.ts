import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SaledProducts extends BaseSchema {
  protected tableName = 'saled_products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sale_id').unsigned().references('id').inTable('sales').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('id').inTable('products')
      table.integer('quantity').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
