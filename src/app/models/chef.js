const db = require('../../config/db')
const { date } = require('../../lib/utils')

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
   update(data) {
      const query = `
      UPDATE chefs SET
      name=($1)
      WHERE id = $2
      `
      const values = [
         data.name,
         data.id
      ]

      return db.query(query, values)
   },
   delete(id, callback) {
      db.query(`DELETE FROM chefs WHERE id = $1`, [id], function (err, results) {
         if (err) throw `Database Error! ${err}`

         callback()
      })
   },
   files(id){
      return db.query(`
         SELECT * FROM files WHERE files.id = $1
      `, [id])
   }
}
