const User = require('../models/User')

module.exports = {
   async list(request, response){
      const { userId: id } = request.session

      let results = await User.all()
      const users = results.rows





      admin = await User.findOne({where: {id}})

      request.session.isAdmin = admin.is_admin

      console.log(request.session)

      return response.render('admin/users/list', {users})
   },
   create(request, response){
      console.log(request.body)
      return response.render('admin/users/create')
   },
   async post(request, response){

      const user = {
	 name: request.body.name,
	 email: request.body.email,
	 is_admin: request.body.is_admin || 0
      }

      let results = await User.create(user)
      const userId = results.rows[0].id

 


      return response.redirect(`/admin/users/${userId}`)
      
   },
   async show(request, response){
      const { id } = request.params


      const user = await User.findOne({where: {id}})

      

      return response.render('admin/users/edit', { user })
   },
   async put(request, response){
      return
   },
   async delete(request, response){
      try{

	 const userId = request.body.id
	 await User.delete(userId)


	 return response.redirect('/admin/users')

      }catch(err){
	 console.error(err)
      }
   }
}
