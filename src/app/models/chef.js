const db = require('../../config/db')
const { date } = require('../../lib/utils')
const  fs  = require('fs')

module.exports = {
   all() {
      return db.query(`SELECT chefs.*, count(recipes) as total_recipes
	 FROM chefs
	 LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
	 GROUP BY chefs.id
	 ORDER BY total_recipes
      `)
   },
   create(data, file_id) {

      const query = `
      INSERT INTO chefs(
         name,
         file_id,
         created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
      `
      const values = [
         data.name,
         file_id,
         date(Date.now()).iso
      ]

      return db.query(query, values)
   },
   find(id) {
      return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON chefs.id = recipes.chef_id
      WHERE chefs.id = $1
      GROUP BY chefs.id
      `, [id])
   },
   findRecipesChef(id, callback) {
      const filePath = `ARRAY(
         SELECT files.path
         FROM files
         LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
         WHERE recipes.id = recipe_files.recipe_id
      )`
      return db.query(`
      SELECT chefs.*, recipes.*, ${filePath}
      FROM chefs
      INNER JOIN recipes ON chefs.id = recipes.chef_id
      WHERE chefs.id = $1
      `, [id]
      )
   },
   async update(data, id) {
      try{
	 const query = `
	 UPDATE chefs SET
	 name=($1),
	 file_id=($2)
	 WHERE id = $3
	 `
	 const value = [
	    data.name,
	    id,
	    data.id
	 ]
	 await db.query(query, value)
	 return
      }catch(err){
	 console.log(err)
      }

   },
   async delete(id) {
      try{

	 const results = await db.query(`
	 SELECT files.*
	 FROM files
	 LEFT JOIN chefs ON (files.id = chefs.file_id)
	 WHERE chefs.id = $1
	 `, [id])

	 const files = results.rows

	 files.map( async file => {
	    fs.unlinkSync(`${file.path}`)
	    await db.query(`DELETE FROM files
	    WHERE id = $1`, [file.id])
	 } )
	 await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
      }catch(err){
	 console.log(err)
      }

   },
   files(id){
      return db.query(`
      SELECT * FROM files
      INNER JOIN chefs ON chefs.file_id = files.id
      WHERE files.id = $1
      `, [id])
   }
}
