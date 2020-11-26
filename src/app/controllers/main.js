const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const file = require('../models/file')


exports.index = async function(request, response){
   try {
      let results = await Recipe.all()
      const recipes = results.rows

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

   console.log(results.rows)

   async function getImage(recipeId){
      let results = await Recipe.files(recipeId)
      const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

	 return files[0]
      }

   const recipePromise = allRecipes.map(async recipe => {
      recipe.img = await getImage(recipe.id)

      return recipe
   })


   console.log(recipePromise)

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
      recipes.push({
         ...recipe,         
         img: `${request.protocol}://${request.headers.host}${array[0].replace('public', '')}` 
      })
   })

   console.log(recipes)

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
   let results = await Recipe.find(request.params.id)
   const recipes = results.rows[0]

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


   return response.render('general/chefs', {chefs})
  
}
