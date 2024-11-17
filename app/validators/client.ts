import vine from '@vinejs/vine'

export const createClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    cpf: vine.string().regex(/^\d{11}$/),
    phones: vine.string().mobile().optional(),
    addresses: vine
      .object({
        street: vine.string().trim().maxLength(200),
        number: vine.string().trim().maxLength(5),
        city: vine.string().trim().maxLength(200),
        state: vine.string().trim().maxLength(200),
        zipCode: vine.string().regex(/^\d{5}-\d{3}$/),
      })
      .optional(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).optional(),
    cpf: vine
      .string()
      .regex(/^\d{11}$/)
      .optional(),
    phones: vine.string().mobile().optional(),
    addresses: vine
      .object({
        street: vine.string().trim().maxLength(200),
        number: vine.string().trim().maxLength(5),
        city: vine.string().trim().maxLength(200),
        state: vine.string().trim().maxLength(200),
        zipCode: vine.string().regex(/^\d{5}-\d{3}$/),
      })
      .optional(),
  })
)
