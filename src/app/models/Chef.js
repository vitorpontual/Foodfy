const Base = require('./Base')
const db = require('../../config/db')

Base.init({table: 'chefs'})

module.exports = {
   ...Base,
   async totalRecipe(){
      try{
	 let query = `
	 SELECT chefs.*, count(recipes) as total_recipes
	 FROM chefs
	 LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
	 GROUP BY chefs.id
	 `
	 let results = await db.query(query)
	 return results.rows
      }catch(err){
	 console.error(err)
      }
   },
   async file(id){
      try{
	 let query = `
	 SELECT *
	 FROM files
	 WHERE id = $1
	 `
	 let results = await db.query(query, [id])
	 return results.rows
      }catch(err){
	 console.error(err)
      }
   }
}
