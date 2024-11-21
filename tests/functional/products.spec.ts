import { test } from '@japa/runner'
import User from '#models/user'
import Product from '#models/product'
import { ProductFactory } from '#database/factories/product_factory'

let token: string

// Grupo para autenticação e obtenção do token
test.group('Auth Setup', () => {
  test('deve autenticar e gerar token para uso nos testes', async ({ client, assert }) => {
    const user = await User.create({
      name: 'Test User',
      email: 'test.user@example.com',
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

// Grupo de testes para as rotas de produtos
test.group('Products', (group) => {
  group.each.teardown(async () => {
    await Product.query().delete()
  })

  test('deve listar todos os produtos ordenados alfabeticamente', async ({ client, assert }) => {
    await Product.create({ name: 'Banana', price: 2.5 })
    await Product.create({ name: 'Apple', price: 3.0 })
    await Product.create({ name: 'watermelon', price: 3.0 })
    await Product.create({ name: 'strawberry', price: 4.5 })

    const response = await client.get('/products').header('Authorization', `Bearer ${token}`).send()

    response.assertStatus(200)
    const products = response.body()
    assert.isArray(products)
    assert.equal(products.length, 4)
    assert.equal(products[0].name, 'Apple')
    assert.equal(products[1].name, 'Banana')
    assert.equal(products[2].name, 'strawberry')
    assert.equal(products[3].name, 'watermelon')
  })

  test('deve retornar os detalhes de um produto', async ({ client, assert }) => {
    const product = await ProductFactory.create()

    const response = await client
      .get(`/products/${product.id}`)
      .header('Authorization', `Bearer ${token}`)
      .send()

    response.assertStatus(200)
    assert.equal(response.body().id, product.id)
    assert.equal(response.body().name, product.name)
    assert.equal(response.body().price, product.price)
  })

  test('deve criar um novo produto', async ({ client, assert }) => {
    const payload = {
      id: 1,
      name: 'costela janela',
      description: 'costelao 12 horas especial, versão nem cusco come, pq não sobra',
      price: 98.9,
    }

    const response = await client
      .post('/products')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(201)
    assert.equal(response.body().name, payload.name)
    assert.equal(response.body().price, payload.price)
  })

  test('deve atualizar os dados de um produto', async ({ client, assert }) => {
    const product = await ProductFactory.create()

    const payload = await ProductFactory.create()

    const response = await client
      .put(`/products/${product.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(200)
    assert.equal(response.body().name, payload.name)
    assert.equal(response.body().price, payload.price)
  })

  test('deve excluir logicamente um produto', async ({ client, assert }) => {
    const product = await ProductFactory.create()

    const response = await client
      .delete(`/products/${product.id}`)
      .header('Authorization', `Bearer ${token}`)
      .send()

    response.assertStatus(200)
    const softDeletedProduct = await Product.query()
      .where('id', product.id)
      .andWhere('deleted', true)
      .first()

    assert.isNotNull(softDeletedProduct)
  })
})
