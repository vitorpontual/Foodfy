const User = require('../models/User')
const Chef = require('../models/chef')
const {compare} = require('bcryptjs')

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
   const fillAllFields = checkAllFields(request.body)
   if(fillAllFields){
      return response.render('admin/users/profile', fillAllFields)
   }
   const { userId: id } = request.session

   const { password} = request.body

   if(!password) return response.render("admin/users/profile", {
      user: request.body,
      error: "Please, put your password to update your form"
   })

   const user = await User.findOne({where: {id}})
   const passed = await compare(password, user.password)
   if(!passed) return response.render('admin/users/profile', {
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

async function put(request, response, next){
   const fillAllFields = checkAllFields(request.body)
   if(fillAllFields){
      return response.render('admin/users/edit', fillAllFields)
   }

   let { email } = request.body
   const user = await User.findOne({where: {email}})


   next()

}

async function list(request, response, next){
   const admin = request.session.isAdmin

   let results = await User.all()
   const users = results.rows
   
   if(!admin){
      return response.render('admin/users/list', {
	 users,
	 error: "Sorry, you can't execute operation"
      })
   }

   next()
}

async function remove(request, response, next){
   const admin = request.session.isAdmin
   let users = await User.all()

   if(!admin){
      return response.render('admin/users/list',{
	 users,
	 error: "Sorry, you not Admin!"
      })
   }

   next()
}

async function editMe(request, response, next){
   const id = request.params.id
   const user = await User.findOne({where: {id}})
   const users = await User.all()

   user.firstName = user.name.split(' ')[0]

   if(request.session.userId == user.id || request.session.isAdmin){
      if(request.session.isAdmin){
	 return response.render('admin/users/edit', {user})
      }
      return response.render('admin/users/profile', {
	 user
      })
   }else{
      return response.render('admin/users/list', {
	 users,
	 error: 'Apenas Administrador ou Próprio Usuário'
      })
   }
}

async function otherAdmin(request, response, next){
   const id = request.body.id
   const userId = request.session.userId
   const user = await User.findOne({where: {id}})


   if(id == userId){
      return response.render('admin/users/edit', {
	 user,
	 error: 'Não pode deletar seu próprio usuário'
      })
   }
   next()
}

module.exports = {
   show,
   post,
   put,
   list,
   profile,
   remove,
   editMe,
   otherAdmin,
}
