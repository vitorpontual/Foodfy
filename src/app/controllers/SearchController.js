const LoadService = require('../services/LoadRecipeService')

const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')


module.exports = {
   async index(request, response){
      let { filter } = request.query

      if(!filter || filter.toLowerCase() == 'todas as receitas') filter = null

      let recipes = await Recipe.search({filter})

      let recipesPromise = await recipes.map(LoadService.format)

      recipes = await Promise.all(recipesPromise)
      console.log(recipes)

      const search = {
	 term: filter || 'Todas as Receitas',
	 total: recipes.length
      }

      return response.render('general/search', {search, recipes})
   }
}

