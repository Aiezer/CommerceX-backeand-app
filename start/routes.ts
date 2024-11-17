/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')

router.post('signup', [AuthController, 'signup'])
router.post('login', [AuthController, 'login'])
router.resource('clients', ClientsController).apiOnly()
