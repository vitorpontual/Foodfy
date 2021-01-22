const Base = require('./Base')
const db = require('../../config/db')

Base.init({table: 'chefs'})

module.exports = {
   ...Base,
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
