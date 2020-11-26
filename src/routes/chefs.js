const express = require('express')
const routes = express.Router()

const multer = require('../app/middleware/multer')

const chefs = require('../app/controllers/chefs')

// Chefs
routes.get('/', chefs.index)
routes.get('/create', chefs.create)
routes.get('/:id', chefs.show)
routes.get('/:id/edit', chefs.edit)

routes.post('/',multer.single('photos'), chefs.post)
routes.put('/', multer.single('photos'), chefs.put)
routes.delete('/', chefs.delete)

module.exports = routes
