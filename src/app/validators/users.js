const User = require('../models/User')

function checkAllFields(body){
   const keys = Object.keys(body)

   for(key of keys){
      if(body[key] == ''){
	 return {
	    user: body,
	    error: 'Por favor, preencha todos os campos'
	 }
      }
   }
}

async function show(request, response, next){
   const { userId: id } = request.session

   const user = await User.findOne({where: {id}})

   if(!user) return response.render('admin/session/login', {
      error: 'User not Found!'
   })

   request.user = user
   next()
}
async function profile(request, response, next){
   const { userId: id } = request.session
   const fillAllFields = checkAllFields(request.body)
   if(fillAllFields){
      return response.render('admin/users/profile', fillAllFields)
   }

   const { password } = request.body
   console.log(id)

   if(!password) return response.render("admin/users/profile", {
      user: request.body,
      error: "Please, put your password to update your form"
   })

   const user = await User.findOne({where: {id}})
   if(password != user.password) return response.render('admin/users/profile', {
      user: request.body,
      error: "Password Incorrect"
   })

   request.user = user

   next()
}

async function post(request, response, next){
   const fillAllFields = checkAllFields(request.body)
   if(fillAllFields){
      return response.render('admin/users/create', fillAllFields)
   }

   let { email } = request.body
   const user = await User.findOne({
      where: {email}
      })


   if(user) return response.render('admin/users/create', {
      user: request.body,
      error: 'User Exist.'
   })

   next()

}

module.exports = {
   show,
   post,
   profile

}
