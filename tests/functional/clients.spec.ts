import { test } from '@japa/runner'
import User from '#models/user'
import Client from '#models/client'

let token: string

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

test.group('Clients', (group) => {
  group.each.teardown(async () => {
    await Client.query().delete()
  })

  test('deve retornar todos os clientes', async ({ client, assert }) => {
    const createdClient = await Client.create({
      name: 'Client One',
      cpf: '12345678901',
    })

    const response = await client.get('/clients').header('Authorization', `Bearer ${token}`).send()

    response.assertStatus(200)
    assert.isArray(response.body())
    assert.equal(response.body()[0].id, createdClient.id)
  })

  test('deve retornar os detalhes de um cliente', async ({ client, assert }) => {
    const createdClient = await Client.create({
      name: 'Client Two',
      cpf: '98765432100',
    })

    const response = await client
      .get(`/clients/${createdClient.id}`)
      .header('Authorization', `Bearer ${token}`)
      .send()

    response.assertStatus(200)
    assert.equal(response.body().id, createdClient.id)
    assert.equal(response.body().name, createdClient.name)
  })

  test('deve criar um novo cliente', async ({ client, assert }) => {
    const payload = {
      name: 'New Client',
      cpf: '12312312312',
      phones: ['123456789'],
      addresses: {
        street: 'Main Street',
        number: '123',
        city: 'City',
        state: 'State',
        zipCode: '12345-678',
      },
    }

    const response = await client
      .post('/clients')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(201)
    assert.equal(response.body().name, payload.name)
    assert.equal(response.body().cpf, payload.cpf)
  })

  test('deve atualizar os dados de um cliente', async ({ client, assert }) => {
    const payload = {
      name: 'New Client',
      cpf: '12312312312',
      phones: ['51987585418', '58987584568'],
      addresses: {
        street: 'Main Street',
        number: '123',
        city: 'City',
        state: 'State',
        zipCode: '12345-678',
      },
    }
    const createdClient = await Client.create(payload)

    const updatePayload = {
      name: 'Updated Client',
      cpf: '98798798798',
    }

    const response = await client
      .put(`/clients/${createdClient.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json(updatePayload)

    response.assertStatus(200)
    assert.equal(response.body().name, updatePayload.name)
    assert.equal(response.body().cpf, updatePayload.cpf)
  })

  test('deve excluir um cliente', async ({ client, assert }) => {
    const createdClient = await Client.create({
      name: 'Client To Delete',
      cpf: '32132132132',
    })

    const response = await client
      .delete(`/clients/${createdClient.id}`)
      .header('Authorization', `Bearer ${token}`)
      .send()

    response.assertStatus(200)

    const deletedClient = await Client.find(createdClient.id)
    assert.isNull(deletedClient)
  })
})
