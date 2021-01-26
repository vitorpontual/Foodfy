const User = require('../models/User')
const mailer = require('../../lib/mailer')
const crypto = require('crypto')
const { hash } = require('bcryptjs')

module.exports = {
   loginForm(request, response){
      return response.render('admin/session/login')
   },
   login(request, response){
      request.session.userId = request.user.id

      return response.redirect('/admin/profile')
   },
   logout(request, response){
      request.session.destroy()

      return response.redirect('/admin/login')
   },
   forgotForm(request, response){
      return response.render('admin/session/forgot-password')
   },
   async forgot(request, response){
      try{
	 const user = request.user
	 // Token para o usuário
	 const token = crypto.randomBytes(20).toString('hex')

	 //criar expiração
	 let now = new Date()
	 now = now.setHours(now.getHours() + 1)

	 await User.update(user.id, {
	    reset_token: token,
	    reset_token_expires: now
	 })

	 // enviar email com um link de recuperação
	 await mailer.sendMail({
	    to: user.email,
	    form: 'no-reply@foodfy.com',
	    subject: 'Recuperação de Senha',
	    html:`
	    <h2>Esqueceu a senha?</h2>
	    <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
	    <p>
	    <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">Recuperar Senha</a>
	    </p>
	    `
	 })
	 // warning user we sent email
	 return response.render('admin/session/forgot-password', {
	    sucess: "Verifique seu email para resetar a senha"
	 })
      }catch(err){
	 console.error(err)
	 return response.render('admin/session/forgot-password', {
	    error: 'Error unexpected, try again!'
	 })
      }
   },
   resetForm(request, response){
      return response.render('admin/session/reset-password', {token: request.query.token})
   },
   async reset(request, response){
      try{
	 const user = request.user
	 const {password, token} = request.body
	 console.log(password)
	 // Create new Password
	 const newPassword = await hash(password, 8)
	 console.log(newPassword)
	 // Update User
	 await User.update(user.id, {
	    password: newPassword,
	    reset_token: "",
	    reset_token_expires: ""
	 })

	 // Notify User have a new Password
	 return response.render("admin/session/login", {
	    user: request.body,
	    sucess: "Password Updated! You can login now!"
	 })
      }catch(err){
	 console.error(err)
	 return response.render("admin/session/reset-password", {
	    user: request.body,
	    token,
	    error: "Error unexpected, try again!"
	 })
      }
   }
}
