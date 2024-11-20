import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    description: vine.string().trim().maxLength(1000),
    price: vine.number().min(0),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    description: vine.string().trim().maxLength(1000).optional(),
    price: vine.number().min(0).optional(),
  })
)
