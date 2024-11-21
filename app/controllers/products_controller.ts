import { HttpContext } from '@adonisjs/core/http'
import { createProductValidator, updateProductValidator } from '#validators/product'
import Product from '#models/product'

export default class ProductsController {
  async index({ response }: HttpContext) {
    const products = await Product.query()
      .where('deleted', false)
      .select('id', 'name', 'price')
      .orderBy('name', 'asc')

    return response.json(products)
  }

  async show({ params, response }: HttpContext) {
    try {
      const product = await this.findProductById(params.id)

      return response.json(product)
    } catch (error) {
      return this.handleError(response, 'Product not found')
    }
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    try {
      const product = await Product.create(payload)
      return response.status(201).json(product)
    } catch (error) {
      return this.handleError(response, 'Error creating product', error)
    }
  }

  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateProductValidator)

    try {
      const product = await this.findProductById(params.id)
      product.merge(payload)
      await product.save()

      return response.status(200).json(product)
    } catch (error) {
      return this.handleError(response, 'Error updating product', error)
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const product = await this.findProductById(params.id)
      product.deleted = true
      await product.save()

      return response.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      return this.handleError(response, 'Error deleting product', error)
    }
  }

  private async findProductById(id: number) {
    return Product.query().where('deleted', false).where('id', id).firstOrFail()
  }

  private handleError(response: any, message: string, error?: any) {
    console.error(error)

    return response.status(500).json({
      error: message,
      details: error ? error.message : 'Unexpected error',
    })
  }
}
