const express = require('express')
const routes = express.Router()

const multer = require('../app/middleware/multer')
const { isAdmin } = require('../app/middleware/session')
const chefs = require('../app/controllers/chefs')

// Chefs
routes.get('/', chefs.index)
routes.get('/create',isAdmin, chefs.create)
routes.get('/:id', chefs.show)
routes.get('/:id/edit',isAdmin, chefs.edit)

routes.post('/',multer.array('photos', 1), chefs.post)
routes.put('/', multer.single('photos'), chefs.put)
routes.delete('/', chefs.delete)

module.exports = routes
