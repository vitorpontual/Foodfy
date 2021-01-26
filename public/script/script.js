const hiddenButton = document.querySelectorAll('.details .botao')
const hidden = document.querySelectorAll('.hide')

for (let i = 0; i < hiddenButton.length; i++) {
    hiddenButton[i].addEventListener('click', () => {

	if (hiddenButton[i].textContent == 'ESCONDER') {
	    hiddenButton[i].innerHTML = 'MOSTRAR'
	    hidden[i].classList.add('active')
	} else {
	    hiddenButton[i].innerHTML = 'ESCONDER'
	    hidden[i].classList.remove('active')
	}
    })
}

function showRecipe(){
   const cards = document.querySelectorAll('.recipes-page .card, .index .card, .container .cards .card')

   for ( let card of cards) {
       card.addEventListener("click", function(){
	   const recipe = card.getAttribute("id")
	  window.location.href = `http://localhost:5000/recipes/${recipe}`
       })
   }
}

const currentPage = location.pathname
const menuItems = document.querySelectorAll('nav a, .navbar a:not(:first-child)')

for (let item of menuItems){
   if (currentPage.includes(item.getAttribute('href'))){
      item.classList.add('active')
   }
}

function checkRemove(event){
   const confirmaton = confirm('Deseja remover o Usuário?')
   if (!confirmaton){
      event.preventDefault()
   }
}

function addIngredient(){
   const ingredients = document.querySelector(".ingredients.new")
   const fieldContainer = document.querySelectorAll('.ingredient')

   const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
   console.log(newField)
   if(newField.children[0].value == '') return true 

   newField.children[0].value = ''
   ingredients.appendChild(newField)
}

function remove(event){
   const list = document.querySelector(`${event}`)
   let c = document.querySelector(`${event}`).childElementCount
   if(c >= 2)
      list.removeChild(list.lastChild)
}

// add prepare

function addPreparation(){
   const preparations = document.querySelector('.preparations.new')
   const fieldContainer = document.querySelectorAll('.preparation')

   const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

   if (newField.children[0].value == '') return false 

   newField.children[0].value = ''
   preparations.appendChild(newField)
}

document
   .querySelector('.add-preparation')
   .addEventListener('click', addPreparation)
/* for (let card of cards) {
    card.addEventListener("click", function(){
       
        modalOverlay.querySelector('img').src = card.querySelector('img').src

        modalOverlay.querySelector('h3').innerHTML = card.querySelector('.card-title-id').innerHTML
       
        
        modalOverlay.querySelector('p').innerHTML = card.querySelector('.card-author').innerHTML
        

        modalOverlay.classList.add('active')
    })
}



document.querySelector('.close-modal').addEventListener('click', function(){
    modalOverlay.classList.remove('active')

}) */

// PAGINATION

