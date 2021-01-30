const {hash} = require('bcryptjs')
const faker = require('faker')

const User = require('./app/models/User')
const Recipe = require('./app/models/Recipe')
const Chef = require('./app/models/Chef')
const File = require('./app/models/File')

let usersIds = []
let chefsIds = []
let totalChef = 3
let totalRecipe = 6
let totalUsers = 2

async function createUser(){
   const users = []
   const password = await hash('1', 8)

   while(users.length < totalUsers){
      users.push({
	 name: faker.name.firstName(),
	 email: faker.internet.email(),
	 password,
	 is_admin: faker.random.number(1)
      })
   }
   const usersPromise = users.map(user => User.create(user))

   usersIds = await Promise.all(usersPromise)
}

async function createChef(){
   const chefs = []
   const files = []
   let count = 0

   while(files.length < totalChef){
      files.push({
	 name: faker.image.image(),
	 path: `public/images/placeholder.png`
      })
   }

   const filesPromise = files.map(file => File.create(file))
   const fileIds = await Promise.all(filesPromise)

   while(chefs.length < totalChef){
      chefs.push({
	 name: faker.name.firstName(),
	 file_id: fileIds[count]
      })
      ++count
   }
   const chefsPromise = chefs.map(chef => Chef.create(chef))
   chefsIds = await Promise.all(chefsPromise)
}

async function createRecipe(){
   const recipes = []
   const files = []

   function fakerSteps(number){
      let arr = []
      for(let i = 0; i < Math.ceil(Math.random() * number); ++i){
	 let words = faker.lorem.words(Math.ceil(Math.random() * number))
	 arr.push(words)
      }
      return arr
   }
   const ingredients = fakerSteps(6)
   const preparations = fakerSteps(4)

   while(recipes.length < totalRecipe){
      recipes.push({
	 chef_id: chefsIds[Math.floor(Math.random() * totalChef)],
	 user_id: usersIds[Math.floor(Math.random() * totalUsers)],
	 title: faker.name.title(),
	 ingredients: `{${ingredients}}`,
	 preparations: `{${preparations}}`,
	 information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
      })
   }
   const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
   recipesIds = await Promise.all(recipesPromise)

   while(files.length < 10){
      files.push({
	 name: faker.image.image(),
	 path: `public/images/placeholder.png`,
	 recipe_id: recipesIds[Math.floor(Math.random() * totalRecipe)]
      })
   }

   const filesPromise = files.map(file => File.createRecipeFiles(file))
   await Promise.all(filesPromise)


}

async function init(){
   await createUser()
   await createChef()
   await createRecipe()
   await console.log('Criado com sucesso')
}

init()
