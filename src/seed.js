const {hash} = require('bcryptjs')
const faker = require('faker')

const User = require('.app/models/User')
const Recipe = require('.app/models/Recipe')
const Chef = require('.app/models/Chef')
const File = require('.app/models/File')

let usersIds = []
let totalChef = 3
let totalRecipe = 6
let totalUsers = 2
