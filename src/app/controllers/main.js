const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const file = require('../models/file')


exports.index = async function(request, response){
   try {
      let recipes = await Recipe.all()

      if(!recipes) return response.send("Recipe not Found!")

      async function getImage(recipeId){
	 let results = await Recipe.files(recipeId)
	 const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

	 return files[0]
      }

      const recipePromise = recipes.map( async recipe => {
	 recipe.img = await getImage(recipe.id)

	 return recipe
      } ).filter((product, index) => index > 2 ? false : true)

      const lastAdded = await Promise.all(recipePromise)

      return response.render('general/index', {recipes: lastAdded})
     
   } catch(err){
      console.error(err)
   }
}


exports.search = async function(request, response){
   let { filter } = request.query
   let results = await Recipe.findBy(filter)
   const allRecipes = results.rows

   if(!allRecipes) return response.send('Recipes not Found!')


   async function getImage(recipeId){
      let results = await Recipe.files(recipeId)
      const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

	 return files[0]
      }

   const recipePromise = allRecipes.map(async recipe => {
      recipe.img = await getImage(recipe.id)

      return recipe
   })


   const recipes = await Promise.all(recipePromise)


   return response.render('general/search', {recipes, filter})
}

exports.about = (request, response) => {
   return response.render("general/about")
}

exports.recipes = async function (request, response) {
   let { filter, page, limit} = request.query


   page = page || 1
   limit = limit || 6
   let offset = limit * (page - 1)

   const params = {
      filter, 
      page,
      limit,
      offset,
   }
   
   let results = await Recipe.pagination(params)
   const allRecipes = results.rows

   recipes = []

   allRecipes.map(recipe => {
      const {array} = recipe
      console.log(array)
      recipes.push({
         ...recipe,         
         img: `${request.protocol}://${request.headers.host}${array[0].replace('public', '')}` 
      })
   })


   if( recipes == ''){
      const paginate = {
         page
      }
      return response.render('general/recipes', {recipes, paginate, filter})
   } else {
      const paginate = {
         total: Math.ceil(recipes[0].total/ limit),
         page
      }
      return response.render('general/recipes', {recipes, paginate, filter})
   }
}
exports.recipesIndex = async function (request, response) {
   const recipes = await Recipe.findOne(request.params.id) 
   console.log(recipes)

   if(!recipes) return response.send('Recipe not found')

   results = await Recipe.files(recipes.id)
   const files = results.rows.map(file => ({
      ...file,
      img: `${request.protocol}://${request.headers.host}${file.path.replace('public','')}`
   }))
  
   return response.render('general/details', {recipes, files})
}

exports.chefs = async function(request, response) {
   let results = await Chef.all()
   const chefs = results.rows

   async function getImage(id){
      let results = await Chef.files(id)
      const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

      return files[0]
   }

   const chefPromise = chefs.map( async file => {
      file.img = await getImage(file.file_id)
      return file
   } )

   const chef = await Promise.all(chefPromise)


   return response.render('general/chefs', {chefs: chef})
  
}
