const Base = require('./Base')
const db = require('../../config/db')

Base.init({ table: 'files' })

module.exports = {
   ...Base,
   async createRecipeFiles({recipe_id, file_id}){
      let query = `
      INSERT INTO recipe_files (
      recipe_id,
      file_id
      )VALUES ($1, $2)
      RETURNING id
      `

      values = [
	      recipe_id,
	      file_id
      ]

      return db.query(query, values)
   }
}
