const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    async create({filename, path, chef_id}) {

        let query = `
        INSERT INTO files (
            name,
            path
        ) VALUES ($1,$2)
        RETURNING id
        `
        let values = [
            filename,
            path,
        ]

       return db.query(query, values)

    },
    async createRecipeFiles({filename, path, recipe_id}){
        let query = `
        INSERT INTO files(
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id`

        let values = [
            filename,
            path
        ]
        const results = await db.query(query, values)
        const fileId = results.rows[0].id

        query = `
        INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1, $2)
        RETURNING id`

        values = [
            recipe_id,
            fileId
        ]

        return db.query(query, values)

    },
   async deleteChefImage(id){
      try{
	 const results = await db.query(`
	 SELECT * FROM files WHERE id = $1
	 `, [id])
	 const file = results.rows[0]

	 fs.unlinkSync(file.path)

	 // LOCAL DELETE
	 await db.query(`DELETE FROM files WHERE id = $1`, [id])
	 return
      }catch(err){
	 console.error(err)
      }
   },
    async delete(id) {
        try {
            const result = await db.query(`
            SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]


            fs.unlinkSync(file.path)

            // LOCAL DELETE

            await db.query(`DELETE FROM recipe_files WHERE recipe_files.file_id = $1`, [id])

            await db.query(`DELETE FROM files WHERE id = $1`, [id])
        } catch (err) {
            console.log(err)
        }
    }
}
