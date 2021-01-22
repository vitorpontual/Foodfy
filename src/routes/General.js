const express = require('express')
const routes = express.Router()

const main = require('../app/controllers/main')
const General = require('../app/controllers/General')
const Search = require('../app/controllers/SearchController')

routes.get('/recipes', General.recipes)
routes.get('/recipes/:id', General.show)
routes.get('/search', Search.index)
routes.get('/about', General.about)
routes.get('/chefs', General.chefs)


module.exports = routes
