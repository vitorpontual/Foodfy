const User = require('../models/User')

const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const { randomPassword } = require('../../lib/utils')

module.exports = {
   async list(request, response) {
      try{
	 const error = request.session.error
	 request.session.error = ''
	 const sucess = request.session.sucess
	 request.session.sucess = ''
	 let users = await User.findAll()

	 return response.render('admin/users/list', { users, error, sucess })
      }catch(err){
	 console.error(err)
      }
   },
   create(request, response) {
      const error = request.session.error
      request.session.error = ''
      return response.render('admin/users/create', { error })
   },
   async post(request, response) {
      try{
	 let { name, email, password, is_admin } = request.body

	 const firstPassword = randomPassword(8)

	 await mailer.sendMail({
	    to: email,
	    from: 'no-replay@foodfy.com.br',
	    subject: 'Sua senha de Acesso',
	    html: `
	    <h2>Olá, ${name}</h2>
	    <p>Sua senha para acessar a administração do Foodfy é:</p>
	    <p><strong>${firstPassword}</strong></p>
	    `
	 })

	 const passwordHash = await hash(firstPassword, 8)

	 await User.create({
	    name,
	    email,
	    password: passwordHash,
	    is_admin: is_admin || 0
	 })

	 const users = await User.findAll()

	 return response.render('admin/users/list', {
	    users,
	    sucess: 'Usuário criado com sucesso!'
	 })



      }catch(err){
	 console.log(err)
      }
   },
   async show(request, response) {
      try{
	 const { id } = request.params

	 const user = await User.findOne({ where: { id } })

	 user.firstName = user.name.split(' ')[0]

	 return response.render('admin/users/edit', { user })
      }catch(err){
	 console.error(err)
      }
   },
   async put(request, response) {
      try {
         let { name, email, is_admin, id } = request.body

         await User.update(id, {
            name,
            email,
            is_admin: request.body.is_admin || 0
         })
	 return response.redirect('/admin/users')
      } catch (err) {
         console.error(err)
      }
   },
   async delete(request, response) {
      try {
         const userId = request.body.id
         User.delete(userId)

         return response.redirect('/admin/users')
      } catch (err) {
         console.error(err)

      }
   }
}
