const User = require('../models/User')

function onlyUsers(request, response, next){
   if(!request.session.userId){
      return response.redirect('/admin/login')
   }

   next()
}

function isLogged(request, response, next){
   if(request.session.userId)
      return response.redirect('/admin/users')
   next()
}

async function isAdmin(request, response, next){
   next()
}

module.exports = {
   onlyUsers,
   isLogged,
   isAdmin
}
