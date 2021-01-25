const express = require('express')
const routes = express.Router()

const multer = require('../app/middleware/multer')
const { isAdmin } = require('../app/middleware/session')
const Chefs = require('../app/controllers/ChefController')
const verify = require('../app/validators/chef')
const chefs = require('../app/controllers/chefs')

// Chefs

routes.get('/', Chefs.index)
routes.get('/create',isAdmin, Chefs.create)
routes.get('/:id', Chefs.show)
routes.get('/:id/edit',isAdmin, Chefs.edit)

routes.post('/', multer.single('photos'), verify.post, Chefs.post)
routes.put('/', multer.single('photos'),verify.put,  Chefs.put)
routes.delete('/', Chefs.delete)

routes.post('/',multer.array('photos', 1), chefs.post)
routes.put('/', multer.single('photos'), chefs.put)
routes.delete('/', chefs.delete)

module.exports = routes
