import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import Client from './client.js'

export default class Phone extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare number: string

  @column()
  declare clientId: number

  @belongsTo(() => Client)
  public client!: relations.BelongsTo<typeof Client>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
