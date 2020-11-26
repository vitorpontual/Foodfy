const User = require('../models/User')

module.exports = {
   index(request, response){
      const { user } = request

      user.firstName = user.name.split(' ')[0]
      
      console.log(user)

      return response.render('admin/users/profile', {user})
   },
   async put(request, response){
      try{
	 const {user} = request
	 let {name, email} = request.body

	 await User.update(user.id, {
	    name,
	    email
	 })

	 return response.render('admin/users/profile', {
	    user: request.body,
	    sucess: 'Conta atualizada com sucesso'
	 })
      }catch(err){
	 console.error(err)
	 return response.render('admin/users/profile', {
	    error: 'Alguma Coisa de errado'
	 })
      }
   }
}
