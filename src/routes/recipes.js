const express = require('express')
const routes = express.Router()

const recipes = require("../app/controllers/admin")
const multer = require('../app/middleware/multer')
const session = require('../app/middleware/session')
const verify = require('../app/middleware/user')

// Recipes
routes.get('/', recipes.index)
routes.get('/create', recipes.create)
routes.get('/:id', recipes.show)
routes.get('/:id/edit', verify.verifyEdit, recipes.edit)

routes.post('/',multer.array('photos', 5), recipes.post)
routes.put('/', multer.array('photos', 5), recipes.put)
routes.delete('/', recipes.delete)

module.exports = routes
