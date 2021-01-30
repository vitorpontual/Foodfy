const { Pool } = require('pg')
require('dotenv/config')

module.exports = new Pool({
   user: `${process.env.USER}`,
   password: `${process.env.DATABASE}`,
   local: 'localhost',
   port: '5432',
   database: 'foodfy 2.0'
})
