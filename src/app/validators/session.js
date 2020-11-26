const User = require('../models/User')

async function login(request, response, next){
   const { email, password } = request.body

   const user = await User.findOne({where: {email}})

   if(!user) return response.render('admin/session/login', {
      user: request.body,
      error: 'Please, SignUp'
   })

   if(password != user.password){
      return response.render('admin/session/login', {
	 user: request.body,
	 error: 'Invalid Password'
      })
   }

   request.user = user
   next()
}


module.exports = {
   login
}
