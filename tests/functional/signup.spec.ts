import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth - Signup', (group) => {
  group.each.teardown(async () => {
    await User.query().delete() // Limpa os usuários após cada teste
  })

  test('deve criar um novo usuário com sucesso', async ({ client, assert }) => {
    const payload = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
    }

    const response = await client.post('/signup').json(payload)

    response.assertStatus(201)
    assert.equal(response.body().email, payload.email)

    // Verifica se o usuário foi criado no banco de dados
    const user = await User.findBy('email', payload.email)
    assert.isNotNull(user)
  })

  test('não deve permitir o cadastro com o mesmo e-mail', async ({ client }) => {
    const payload = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'Password123',
    }

    // Primeiro cadastro
    await User.create(payload)

    // Tentativa de cadastrar novamente
    const response = await client.post('/signup').json(payload)

    response.assertStatus(400)
    response.assertBodyContains({ error: 'Email already exists' })
  })

  test('deve falhar se a senha não atender aos critérios de segurança', async ({ client }) => {
    const payload = {
      name: 'Invalid User',
      email: 'invalid@example.com',
      password: '12345678', // Sem letra maiúscula ou número
    }

    const response = await client.post('/signup').json(payload)

    response.assertStatus(422) // Status 422 para erro de validação
    response.assertBodyContains({
      errors: [
        {
          message: 'The password field format is invalid',
          rule: 'regex',
          field: 'password',
        },
      ],
    })
  })
})
