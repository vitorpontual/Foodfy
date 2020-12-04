const express = require("express")
const routes = express.Router()
const mainController = require("../app/controllers/main")

const main = require('./main')
const admin = require('./admin')
const chefs = require('./chefs')
const recipes = require('./recipes')

const { onlyUsers, isAdmin } = require('../app/middleware/session')

routes.get('/', mainController.index)

routes.use('/', main)
routes.use('/admin', admin)
routes.use('/admin/chefs', onlyUsers, chefs)
routes.use('/admin/recipes', onlyUsers, recipes)


module.exports = routes
