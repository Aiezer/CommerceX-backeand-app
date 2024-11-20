import { SaleFactory } from '#database/factories/sale_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await SaleFactory.create()
  }
}
