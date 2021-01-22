const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(request, response, next) {
   const { email, password } = request.body

   const user = await User.findOne({ where: { email } })

   if (!user) return response.render('admin/session/login', {
      user: request.body,
      error: 'Usuário não permitido'
   })

   const passed = await compare(password, user.password)
   if (!passed) {
      return response.render('admin/session/login', {
         user: request.body,
         error: 'Senha Inválida'
      })
   }

   request.user = user
   request.session.isAdmin = user.is_admin
   console.log(request.session.isAdmin)
   next()
}

async function forgot(request, response, next) {
   try {
      const { email } = request.body

      let user = await User.findOne({ where: { email } })

      if (!user) return response.render("admin/session/forgot-password", {
         user: request.body,
         error: 'Email não encontrado!'
      })

      request.user = user

      next()
   } catch (err) {
      console.error(err)
   }
}

async function reset(request, response, next) {
   try {
      const { email, password, token, passwordRepeat } = request.body
      // Search User
      const user = await User.findOne({ where: { email } })


      if (!user) return response.render("admin/session/reset-password", {
         user: request.body,
         token,
         error: "Usuário não cadastrado"
      })

      // Password Match
      if (password != passwordRepeat) return response.render('admin/session/reset-password', {
         user: request.body,
         token,
         error: 'Senha Inválida'
      })

      // Verify Token
      if (token != user.reset_token) return response.render("admin/session/reset-password", {
         user: request.bdoy,
         toekn,
         erro: 'Token Inválido'
      })

      // Verify Token Expire
      let now = new Date()
      now = now.setHours(now.getHours())

      if (now > user.reset_token_expires) return response.render("admin/session/reset-password", {
         user: request.body,
         token,
         error: 'O token expirou, por favor solicitar outro'
      })

      request.user = user
      next()
   } catch (err) {
      console.error(err)
   }
}

module.exports = {
   login,
   forgot,
   reset
}
