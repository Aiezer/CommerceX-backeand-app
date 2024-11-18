import Product from '#models/product'

export async function calculateTotalPrice(products: { productId: number; quantity: number }[]) {
  const productIds = products.map((prod) => prod.productId)

  const foundProducts = await Product.query().whereIn('id', productIds)

  if (foundProducts.length !== productIds.length) {
    const missingIds = productIds.filter(
      (id) => !foundProducts.some((product) => product.id === id)
    )
    throw new Error(`Produtos com IDs ${missingIds.join(', ')} não foram encontrados`)
  }

  let totalPrice = 0
  for (const prod of products) {
    const product = foundProducts.find((p) => p.id === prod.productId)!
    totalPrice += product.price * prod.quantity
  }

  return Number(totalPrice.toFixed(2))
}
