const User = require('../models/User')

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
   }
}
