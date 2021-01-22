const Base = require('./Base')
const db = require('../../config/db')

Base.init({ table: 'files' })

module.exports = {
   ...Base,
   async createRecipeFiles({name, path, recipe_id}){
      let query = `INSERT INTO files(
      name,
      path
      )VALUES($1, $2)
      RETURNING id`

      let results = await db.query(query, [name, path])
      let file_id = results.rows[0].id

      query = `
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
      console.log(values)

      return db.query(query, values)
   }
}
