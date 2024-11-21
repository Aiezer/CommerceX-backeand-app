import type { HttpContext } from '@adonisjs/core/http'
import { signupValidator } from '#validators/auth'

import User from '#models/user'

export default class AuthController {
  async signup({ request, response }: HttpContext) {
    const data = await request.validateUsing(signupValidator)

    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.status(400).json({ error: 'Email already exists' })
    }

    const user = await User.create(data)

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      token: token.value!.release(),
    }
  }
}
