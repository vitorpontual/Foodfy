function post(request, response, next){
   const keys = Object.keys(request.body)

   for(key of keys){
      if(request.body[key] == ''){
	 console.log('ok')
	 request.session.error = 'Por favor, preencha todos os campos'
	 return response.redirect('back')
      }
      if(!request.file){
	 request.session.error = 'Envie uma foto pelomenos!'
	 return response.redirect('back')
      }
   }
   next()
}

function put (request, response, next){
   const keys = Object.keys(request.body)

   for(key of keys){
      if(request.body[key] == '' && key != "removed_files"){
	 request.session.error = 'Por favor, preencha todos os campos'
	 return response.redirect('back')
      }
   }
   next()
}

module.exports = {
   post,
   put
}
