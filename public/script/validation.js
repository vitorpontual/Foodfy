const Validate = {
   apply(input, foo){
      Validate.clearErrors(input)

      let results = Validate[foo](input.value)
      input.value = results.value

      if (results.error){
	 Validate.displayError(input, results.error)
      }
   },
   displayError(input, error){
      const div = document.createElement('div')
      div.classList.add('error')
      div.innerHTML = error
      input.parentNode.appendChild(div)
   },
   clearErrors(input){
      const errorDiv = input.parentNode.querySelector('.error')
      if (errorDiv)
	 errorDiv.remove()
   },
   isEmail(value){
      let error = null
      const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

      if(!value.match(mailFormat))
	 error = 'Invalid Email'
      return {
	 error,
	 value
      }
   }
}
