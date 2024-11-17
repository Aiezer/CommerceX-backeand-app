import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'

export default class AuthController {
  async signup({ request }: HttpContext) {
    const data = request.only(['name', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async login({ request }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }
}
