/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')
const SalesController = () => import('#controllers/sales_controller')
const ProductsController = () => import('#controllers/products_controller')
// const AuthMiddleware = () => import('#middleware/auth_middleware')

router.post('signup', [AuthController, 'signup'])
router.post('login', [AuthController, 'login'])
router
  .resource('clients', ClientsController)
  .apiOnly()
  .use(
    '*',
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .resource('sales', SalesController)
  .apiOnly()
  .only(['store'])
  .use(
    '*',
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .resource('products', ProductsController)
  .apiOnly()
  .use(
    '*',
    middleware.auth({
      guards: ['api'],
    })
  )
