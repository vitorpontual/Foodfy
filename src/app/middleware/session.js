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
   if(!request.session.isAdmin){
      request.session.error = 'Apenas Adminstradores podem realizar está operação!'
      return response.redirect(`back`)

   }
   next()
}


module.exports = {
   onlyUsers,
   isLogged,
   isAdmin,
}
