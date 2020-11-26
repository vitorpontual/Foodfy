const buttons = document.querySelectorAll('.botao')
const hidden = document.querySelectorAll('.hide')
const cards = document.querySelectorAll('.card')

for ( let card of cards) {
    card.addEventListener("click", function(){
        const recipe = card.getAttribute("id")
       window.location.href = `http://localhost:5000/recipes/${recipe}`
    })
}

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {

        if (buttons[i].textContent == 'ESCONDER') {
            buttons[i].innerHTML = 'MOSTRAR'
            hidden[i].classList.add('active')
        } else {
            buttons[i].innerHTML = 'ESCONDER'
            hidden[i].classList.remove('active')
        }
    })
}

const currentPage = location.pathname
const menuItems = document.querySelectorAll('#user-page nav a')

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
// add Ingredient

function addIngredient(){
   const ingredients = document.querySelector(".ingredients")
   const fieldContainer = document.querySelectorAll('.ingredient')

   const newField = fieldContainer[fieldContainer.length -1].cloneNode(true)

   if(newField.children[0].value == '') return false

   newField.children[0].value = ''
   ingredients.appendChild(newField)
}


document
   .querySelector('.add-ingredient')
   .addEventListener('click', addIngredient)

// add prepare

function addPreparation(){
   const preparations = document.querySelector('.preparations')
   const fieldContainer = document.querySelectorAll('.preparation')

   const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

   if (newField.children[0].value== '') return false

   newField.children[0].value = ''
   preparations.appendChild(newField)
}

document
   .querySelector('.add-prepare')
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

