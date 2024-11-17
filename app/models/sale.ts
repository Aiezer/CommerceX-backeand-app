import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import SalesProducts from './sales_products.js'

export default class Sale extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare totalPrice: number

  @column.dateTime()
  declare saleDate: DateTime

  @belongsTo(() => Client)
  public client: relations.BelongsTo<typeof Client>

  @hasMany(() => SalesProducts)
  public salesProducts: relations.HasMany<typeof SalesProducts>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
