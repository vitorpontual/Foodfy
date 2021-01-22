const express = require('express')
const routes = express.Router()

const recipes = require("../app/controllers/admin")
const Recipes = require('../app/controllers/RecipesController')
const multer = require('../app/middleware/multer')
const session = require('../app/middleware/session')
const verify = require('../app/middleware/user')
const validator = require('../app/validators/recipes')

// Recipes
routes.get('/', Recipes.index)
routes.get('/create', Recipes.create)
routes.get('/:id', Recipes.show)
routes.get('/:id/edit', verify.verifyEdition, Recipes.edit)

routes.post('/',multer.array('photos', 5), validator.post,  Recipes.post)
routes.put('/', multer.array('photos', 5), validator.put, Recipes.put)



routes.put('/', multer.array('photos', 5), recipes.put)
routes.delete('/', recipes.delete)

module.exports = routes
