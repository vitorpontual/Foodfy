const Recipe = require('../models/Recipe')
const File = require('../models/File')
const Chef = require('../models/Chef')
const LoadRecipe = require('../services/LoadRecipeService')
const LoadChef = require('../services/LoadChefService')



module.exports = {
   async index(request, response){
      try{
	 const recipesAll = await LoadRecipe.load('recipes')

	 const recipes = recipesAll.filter((recipe, index) => index > 2 ? false : true)
	 return response.render('general/index', { recipes })
      }catch(err){
	 console.error(err)
      }
   },
   about(request, response){
      return response.render('general/about')
   },
   async show( request, response) {
      try{
	 const recipes = await LoadRecipe.load('recipe', {
	    where: {id: request.params.id}
	 })

	 return response.render('general/details', { recipes })
      }catch(err){
	 console.error(err)
      }
   },
   async recipes(request, response){
      try{
	 let {page, limit} = request.query
	 page = page || 1
	 limit = limit || 3
	 let offset = limit * (page - 1)

	 const  params = {
	    page, limit, offset
	 }
	 let recipes = await Recipe.paginate(params)
	 const recipesPromise = recipes.map(LoadRecipe.format)

	 recipes = await Promise.all(recipesPromise)

	 const paginate = {
	    total: Math.ceil(recipes[0].total / limit),
	    page
	 }



	 return response.render('general/recipes', { paginate, recipes})
      }catch(err){
	 console.error(err)
      }
   },
   async chefs(request, response){
      const chefs = await LoadChef.load('chefs')

      return response.render('general/chefs', {chefs})
   }
}
