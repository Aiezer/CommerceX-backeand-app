import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Phone from './phone.js'
import Address from './address.js'
import { DateTime } from 'luxon'
import * as relations from '@adonisjs/lucid/types/relations'
import Sale from './sale.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public cpf: string

  @hasMany(() => Phone)
  public phones: relations.HasMany<typeof Phone>

  @hasMany(() => Address)
  public addresses: relations.HasMany<typeof Address>

  @hasMany(() => Sale)
  public sales: relations.HasMany<typeof Sale>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
