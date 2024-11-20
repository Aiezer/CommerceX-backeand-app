import vine from '@vinejs/vine'

export const signupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().email().toLowerCase(),
    password: vine
      .string()
      .minLength(8)
      .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/), // Pelo menos uma letra maiúscula e um número
  })
)
