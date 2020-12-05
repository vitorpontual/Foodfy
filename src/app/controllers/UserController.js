const User = require('../models/User')

module.exports = {
   async list(request, response){
      let { userId: id } = request.session

      let user_id = await User.findOne({where: {id}})
      request.session.isAdmin = user_id.is_admin

      let users = await User.all()
      users.map(user => {
	 user.firstName = user.name.split(' ')[0]

	 return user
      })


      return response.render('admin/users/list', {users})
   },
   create(request, response){
      return response.render('admin/users/create')
   },
   async post(request, response){

      let user = await User.create(request.body)
      let users = await User.all()


      return response.render(`admin/users/list`, {
	 users,
	 sucess: 'User Criado com Sucesso!'
      })
      
   },
   async show(request, response){
      const { id } = request.params

      const user = await User.findOne({where: {id}})
      console.log(user.id, request.session.userId)

      user.firstName = user.name.split(' ')[0]

      return response.render('admin/users/edit', { user })
   },
   async put(request, response){
      try{
	 let { name, email, is_admin, id} = request.body

	 await User.update(id, {
	    name,
	    email,
	    is_admin: request.body.is_admin || 0
	 })

	 return response.render('admin/users/edit', {
	    user: request.body,
	    sucess: 'Account Updated'
	 })
      }catch(err){
	 console.log(err)
      }
   },
   async delete(request, response){
      try{
	 const userId = request.body.id
	 User.delete(userId)

	 return response.redirect('/admin/users')
      }catch(err){
	 console.error(err)
	 
      }
   }
}
