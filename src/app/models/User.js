const db = require('../../config/db')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const { randomPassword } = require('../../lib/utils')

module.exports = {
   async all() {
      const results = await db.query(`SELECT * FROM users`)
      return results.rows
   },
   async create(data) {
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

      await mailer.sendMail({
         to: data.email,
         form: 'no-replay@foodfy.com.br',
         subject: 'Sua senha de Acesso',
         html: `
	 <h2>Olá, ${data.name}</h2>
	 <p>Sua senha para acessar a adminstração do Foodfy é:</p>
	 <p>${firstPassword}</p>
	 `
      })

      const passwordHash = await hash(firstPassword, 8)

      values = [
         data.name,
         data.email,
         passwordHash,
         data.is_admin || 0
      ]

      const results = await db.query(query, values)
      return results.rows[0].id

   },
   async findOne(filters) {
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
   async update(id, fields) {
      let query = `
      UPDATE users SET
      `
      Object.keys(fields).map((key, index, array) => {
         if ((index + 1) < array.length) {
            query = `
	    ${query}
	    ${key}='${fields[key]}',
	    `
         } else {
            query = `
	    ${query}
	    ${key}='${fields[key]}'
	    WHERE id = '${id}'
	    `
         }
      })
      await db.query(query)
      return
   },
   delete(id) {
      return db.query(`DELETE FROM users WHERE id = $1`, [id])
   }
}
