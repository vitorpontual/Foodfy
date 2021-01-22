const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const LoadRecipe = require('../services/LoadRecipeService')
const {date} = require('../../lib/utils')

module.exports = {
   async index(request, response){
      let {page, limit} = request.query

      page = page || 1
      limit = limit || 4
      let offset = limit * ( page - 1 )

      const params = {
	 page, limit, offset
      }
      let recipes = await Recipe.paginate(params)
      const recipesPromise = recipes.map(LoadRecipe.format)

      recipes = await Promise.all(recipesPromise)

      const paginate = {
	 total: Math.ceil(recipes[0].total / limit),
	 page
      }

      return response.render('admin/recipes/index', {recipes, paginate})

   },
   async show(request, response){
      try{
	 const recipes = await LoadRecipe.load('recipe', {where: {
	    id: request.params.id
    }})
    
    const error = request.session.error
    request.session.error = ''
    const success = request.session.success
    request.session.success = ''
	 return response.render('admin/recipes/show', {recipes, error, success})
      }catch(err){
	 console.error(err)
      }
   },
   async edit(request, response){
      try{
	 const recipes = await LoadRecipe.load('recipe', {where: {
	    id: request.params.id
	 }})


	 const chefsOption = await Chef.findAll()

	 return response.render('admin/recipes/edit', {chefsOption, recipes})
      }catch(err){
	 console.error(err)
      }
   },
   async create(request, response){
      try{
	 let chefsOption = await Chef.findAll()
	 return response.render('admin/recipes/create', {chefsOption})

      }catch(err){
	 console.error(err)
      }
   },
   async post(request, response){
      try{
	 let {chef_id, title, ingredients, preparations, information, user_id} = request.body
	 console.log(request.body)

	 const recipe = await Recipe.create({
	    chef_id,
	    title,
	    ingredients,
	    preparations,
	    information,
	    user_id: request.session.userId,
	    created_at: date(Date.now()).iso

	 })

	 return response.redirect(`/admin/recipes/${recipe}`)
      }catch(err){
	 console.error(err)
      }
   }
}
