import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth - Login', (group) => {
  let user: User

  group.setup(async (group) => {
    user = await User.create({
      name: 'John Login',
      email: 'john.login@example.com',
      password: 'Password123', // Certifique-se de que sua hash esteja configurada corretamente
    })
  })

  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('deve autenticar o usuário com credenciais corretas', async ({ client, assert }) => {
    const payload = {
      email: user.email,
      password: 'Password123',
    }

    const response = await client.post('/login').json(payload)

    response.assertStatus(200)
    assert.equal(response.body().type, 'bearer')
    assert.property(response.body(), 'token')
  })

  test('não deve autenticar com credenciais inválidas', async ({ client }) => {
    const payload = {
      email: user.email,
      password: 'WrongPassword',
    }

    const response = await client.post('/login').json(payload)

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })

  test('não deve autenticar se o e-mail não estiver cadastrado', async ({ client }) => {
    const payload = {
      email: 'not.registered@example.com',
      password: 'Password123',
    }

    const response = await client.post('/login').json(payload)

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials',
        },
      ],
    })
  })
})
