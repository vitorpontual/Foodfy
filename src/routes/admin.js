const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const ProfileController = require('../app/controllers/ProfileController')
const UserController = require('../app/controllers/UserController')

const { isLogged, onlyUsers, isAdmin } = require('../app/middleware/session')

const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/users')

// Login/logout
routes.get('/login', isLogged, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)
// reset password / forgot
routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)

routes.get('/reset-password', SessionController.resetForm)
routes.post('/reset-password', SessionValidator.reset, SessionController.reset)

// Profile
routes.get('/profile', onlyUsers, UserValidator.show, ProfileController.index)
routes.put('/profile', onlyUsers, UserValidator.profile, ProfileController.put)

// User Admin
routes.get('/users', onlyUsers, UserController.list)
routes.get('/create', onlyUsers, isAdmin, UserController.create)
routes.get('/users/:id', onlyUsers,UserValidator.editMe, UserController.show )

routes.post('/users', onlyUsers, isAdmin, UserValidator.post, UserController.post)
routes.put('/users',onlyUsers, UserValidator.put,  UserController.put)
routes.delete('/users', onlyUsers, isAdmin, UserController.delete)

module.exports = routes
