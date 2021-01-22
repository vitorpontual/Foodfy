const Base = require('./Base')
const db = require('../../config/db')

Base.init({table: 'recipes'})

module.exports = {
   ...Base,
   async file(id){

      let query = `SELECT *
	 FROM recipe_files
	 INNER JOIN recipes ON (recipes.id = recipe_files.recipe_id)
	 INNER JOIN files ON (files.id = recipe_files.file_id)
	 WHERE recipes.id = $1`

      let results = await db.query(query,[id])
      return results.rows
   },
   async search({filter}){
      try{
	 let query = `
	 SELECT recipes.*, chefs.name as chef_name
	 FROM recipes
	 LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
	 WHERE 1 = 1
	 `
	 if(filter){
	    query += `AND (recipes.title ILIKE '%${filter}%')
	    OR chefs.name ILIKE '%${filter}%'`
	 }
	 let results = await db.query(query)
	 return results.rows
      }catch(err){
	 console.error(err)
      }
   }
}
