function post(request, response, next){
   const keys = Object.keys(request.body)

   if(request.body.information == ''){
      request.body.information = "Sem informações adicionais!!"
   }

   for(key of keys){
      if(request.body[key] == ''){
	 request.session.body = request.body
	 request.session.error = 'Por favor, preencha todos os campos'
	 return response.redirect('back')
      }
   }
   next()
}

function put (request, response, next){
   const keys = Object.keys(request.body)

   for(key of keys){
      if(request.body[key] == '' && key != "removed_files"){
	 console.log('ok')
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
