   const express = require("express")
   const routes = express.Router()
   const General = require('../app/controllers/General')

   const main = require('./General')
   const admin = require('./admin')
   const chefs = require('./chefs')
const recipes = require('./recipes')

const { onlyUsers, isAdmin } = require('../app/middleware/session')

routes.get('/', General.index)

routes.use('/', main)
routes.use('/admin', admin)
routes.use('/admin/chefs', onlyUsers, chefs)
routes.use('/admin/recipes', onlyUsers, recipes)


module.exports = routes
