const User = require('../models/User')

module.exports = {
   index(request, response){
      const { user } = request


      user.firstName = user.name.split(' ')[0]

      return response.render('admin/users/profile', {user})
   },
   async put(request, response){
      try{
	 const {id: userId, email: userEmail} = request.user
	 const { name, email } = request.body
	 

	 if(email == userEmail){
	    await User.update(userId, {
	       name
	    })
	 } else {
	    await User.update(userId, {
	       name,
	       email
	    })
	 }


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
