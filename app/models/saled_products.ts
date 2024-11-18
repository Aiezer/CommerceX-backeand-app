import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Sale from './sale.js'
import Product from './product.js'

export default class SaledProducts extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare saleId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @belongsTo(() => Sale)
  public sale: relations.BelongsTo<typeof Sale>

  @hasOne(() => Product)
  public product: relations.HasOne<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
