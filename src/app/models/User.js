const db = require('../../config/db')
const { randomPassword } = require('../../lib/utils')

module.exports = {
   all(){
      return db.query(`SELECT * FROM users`)
   },
   create(data){
      query = `
      INSERT INTO users(
      name,
      email,
      password,
      is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
      `
      const firstPassword = randomPassword(8)

      value = [
	 data.name,
	 data.email,
	 firstPassword,
	 data.is_admin
      ]

      return db.query(query, value)
   },
   async findOne(filters){
      let query = `SELECT * FROM users`

      Object.keys(filters).map(key => {
	 // WHERE | OR | AND
	 query = `
	 ${query}
	 ${key}
	 `
	 Object.keys(filters[key]).map(value => {
	    query = `${query} ${value} = '${filters[key][value]}'`
	 })
      })

      const results = await db.query(query)
      return results.rows[0]
   },
   async update(id, fields){
      let query = `
      UPDATE users SET
      `
      Object.keys(fields).map((key, index, array) => {
	 if((index + 1) < array.length){
	    query = `
	    ${query}
	    ${key}='${fields[key]}',
	    `
	 } else {
	    query = `
	    ${query}
	    ${key}='${fields[key]}'
	    WHERE id = ${id}
	    `
	 }
      })
      await db.query(query)
      return 
   },
   delete(id){
      console.log(id)
      return db.query(`DELETE FROM users WHERE id = $1`, [id])
   }
}
