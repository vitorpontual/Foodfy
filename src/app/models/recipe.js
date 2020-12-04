const db = require('../../config/db')
const { date } = require('../../lib/utils')
const fs = require('fs')

module.exports = {
   async all(){

      const query = `
      SELECT recipes.*, chefs.name As chefs_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY recipes.id
      `



      const results = await db.query(query)
      return results.rows
   },
   create(data){
      query = `
      INSERT INTO recipes (
      chef_id,
      title,
      ingredients,
      preparations,
      information,
      created_at,
      user_id
      ) VALUES ($1, $2, $3, $4, $5,$6, $7)
      RETURNING id
      `
      console.log(data)
      values = [
         data.chef_id,
         data.title,
         data.ingredients,
         data.preparations,
         data.information,
	 date(Date.now()).iso,
	 data.user_id,

	 
      ]

      return db.query(query, values)

   },
   async findOne(id){
      const query = `
      SELECT recipes.*, chefs.name as chefs_name
      FROM recipes
      LEFT JOIN chefs ON chefs.id = recipes.chef_id
      WHERE recipes.id = $1
      `

      const results = await db.query(query, [id])
      return results.rows[0]
   },
   findBy(filter){
      const filePath = `(
         SELECT files.path
         FROM files
         LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
         WHERE recipes.id = recipe_files.recipe_id
      ) AS file_path`
      return db.query(`
      SELECT recipes.*, chefs.name AS chefs_name, ${filePath}
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE recipes.title ILIKE '%${filter}%'
      OR chefs.name ILIKE '%${filter}%'
      `)
   },
   chefSelectOption(){
      return db.query(`SELECT name, id FROM chefs`)
   },
   update(data){
      const query = `
      UPDATE recipes SET
      chef_id=($1),
      title=($2),
      ingredients=($3),
      preparations=($4),
      information=($5)
      WHERE id = ($6)
      `

      const values = [
      data.chef_id,
      data.title,
      data.ingredients,
      data.preparations,
      data.information,
      data.id,
      ]


      return db.query(query, values)
   },
   async delete(id){
      let results = await db.query(`
      SELECT * FROM files
      INNER JOIN recipe_files ON recipe_files.file_id = files.id
      WHERE recipe_files.recipe_id = $1
      `, [id])

      const files = results.rows.map( async file => {
	 try{ 
	    fs.unlinkSync(file.path)
	    await db.query(`DELETE FROM files WHERE id = $1`, [file.file_id])
	 }catch(err){
	    console.error(err)
	 }
      })

      return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
   },
   pagination(params){
      const { filter, limit, offset} = params
      let query = '',
      filterQuery= '',
      filePath = `ARRAY(
         SELECT files.path
         FROM files
         LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
         WHERE recipes.id = recipe_files.recipe_id
      )`,
      totalQuery = `(
         SELECT count(*) FROM recipes
      ) AS total`

      
      if(filter){
         filterQuery = `
         WHERE recipes.title ILIKE '%${filter}%'
         `

         totalQuery = `(
            SELECT count(*) FROM recipes
            ${filterQuery}
            ) AS total
         `
      }

      query = `
      SELECT recipes.*, ${totalQuery}, chefs.name as chefs_name, ${filePath}
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      LIMIT $1 OFFSET $2
      `


      return db.query(query, [limit, offset])
   },

   files(id){
      return db.query(`
      SELECT files.* FROM files
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = $1`, [id])
   },
   recipeFiles(id){

      const filePath = `
      (SELECT files.path
      FROM files
      LEFT JOIN recipes_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = $1
      LIMIT 1)`

      const query = `

      SELECT *, '${filePath}'
      FROM recipes
      LEFT JOIN recipe_files ON (recipes.id = recipe_files.recipe_id)
      WHERE recipes.id = $1
      LIMIT 1
      `

      return db.query(query, [id])
   }
}
