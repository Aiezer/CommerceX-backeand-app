import { HttpContext } from '@adonisjs/core/http'
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
    const product = await Product.query().where('deleted', false).where('id', params.id).first()

    if (!product) {
      return response.notFound({ error: 'Produto não encontrado' })
    }

    return response.json(product)
  }
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'description', 'price'])

    try {
      const product = await Product.create(data)
      return response.status(201).json(product)
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao criar produto', details: error.message })
    }
  }

  async update({ params, request, response }: HttpContext) {
    const data = request.only(['name', 'description', 'price'])

    const product = await Product.find(params.id)
    if (!product) {
      return response.notFound({ error: 'Produto não encontrado' })
    }

    try {
      product.merge(data)
      await product.save()

      return response.status(200).json(product)
    } catch (error) {
      return response
        .status(500)
        .json({ error: 'Erro ao atualizar produto', details: error.message })
    }
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.find(params.id)

    if (!product) {
      return response.notFound({ error: 'Produto não encontrado' })
    }

    product.deleted = true
    await product.save()

    return response.status(200).json({ message: 'Produto excluído com sucesso' })
  }
}
