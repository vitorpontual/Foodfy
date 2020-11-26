const express = require('express')
const routes = express.Router()

const main = require('../app/controllers/main')

routes.get('/about', main.about)
routes.get('/search', main.search)
routes.get('/recipes', main.recipes)
routes.get('/recipes/:id', main.recipesIndex)
routes.get('/chefs', main.chefs)

module.exports = routes
