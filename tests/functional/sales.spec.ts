import { test } from '@japa/runner'
import User from '#models/user'
import Client from '#models/client'
import Product from '#models/product'
import Sale from '#models/sale'
import SaledProducts from '#models/saled_products'

let token: string

// Grupo para autenticação e obtenção do token
test.group('Auth Setup', () => {
  test('deve autenticar e gerar token para uso nos testes', async ({ client, assert }) => {
    const user = await User.create({
      name: 'Test User',
      email: 'test2.user@example.com',
      password: 'Password123',
    })

    const response = await client.post('/login').json({
      email: user.email,
      password: 'Password123',
    })

    response.assertStatus(200)
    token = response.body().token
    assert.exists(token, 'Token não foi gerado corretamente')
  })
})

test.group('Sales', (group) => {
  let clientId: number
  let productIds: number[]

  group.setup(async () => {
    // Criação de cliente
    const client = await Client.create({
      name: 'Client One',
      cpf: '12345678901',
    })

    // Garante que o ID está definido
    if (!client.id) {
      throw new Error('O ID do cliente não foi gerado corretamente')
    }
    clientId = client.id

    // Criação de produtos
    const products = await Product.createMany([
      { name: 'Product A', price: 10.0 },
      { name: 'Product B', price: 15.0 },
    ])
    productIds = products.map((product) => product.id!)
  })

  group.each.teardown(async () => {
    await Sale.query().delete()
    await SaledProducts.query().delete()
    await Product.query().delete()
    await Client.query().delete()
  })

  test('deve criar uma venda com produtos válidos', async ({ client, assert }) => {
    const payload = {
      clientId,
      products: [
        { productId: productIds[0], quantity: 2 },
        { productId: productIds[1], quantity: 1 },
      ],
    }

    const response = await client
      .post('/sales')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(201)
    const sale = response.body()

    // Verifica informações básicas
    assert.exists(sale.id, 'ID da venda não foi retornado')
    assert.equal(sale.clientId, payload.clientId)
    assert.closeTo(sale.totalPrice, 35.0, 0.01)
  })
})
