const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const LoadRecipe = require('../services/LoadRecipeService')
const LoadChef = require('../services/LoadChefService')
const File = require('../models/File')
const {date} = require('../../lib/utils')
module.exports = {
   async index(request, response){
      let chef = await LoadChef.load('chefs')

      return response.render('admin/chefs/index', {chef})
   },
   create(request, response){
      return response.render('admin/chefs/create')
   },
   async post(request, response){
      try{
	 const file = request.file
	 const file_id = await File.create({name: file.filename, path: file.path})

	 let { name } = request.body

	 const chefs = await Chef.create({
	    name,
	    file_id,
	    created_at: date(Date.now()).iso
	 })

	 return response.redirect(`admin/chefs/${chefs}`)
      }catch(err){
	 console.error(err)
      }
   },
   async show(request, response){
      try{
	 const chefs = await LoadChef.load('chef', {where: {id: request.params.id}})
	 const recipes = await LoadRecipe.load('recipes')

	 let recipesChefs = []

	 let recipesPromise = await recipes.map(recipe =>
	    {
	       if(recipe.chef_id == chefs.id){
		  recipesChefs.push(recipe)
	       }
	    }
	 )

	 return response.render('admin/chefs/show', {chefs, recipesChefs})
      }catch(err){
	 console.error(err)
      }
   },
   async edit(request, response){
      try{
	 let chefs = await LoadChef.load('chef', {where: {id: request.params.id}})
	 console.log(chefs)

	 return response.render('admin/chefs/edit', {chefs})
      }catch(err){
	 console.error(err)
      }
   }
}
