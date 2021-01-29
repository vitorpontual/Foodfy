const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const LoadRecipe = require('../services/LoadRecipeService')
const LoadChef = require('../services/LoadChefService')
const File = require('../models/File')
const {date} = require('../../lib/utils')
const {unlinkSync} = require('fs')

module.exports = {
   async index(request, response){
      let chef = await LoadChef.load('chefs')
      const error = request.session.error
      request.session.error = ''

      return response.render('admin/chefs/index', {chef, error})
   },
   create(request, response){
	 const error = request.session.error
	 request.session.error = ''
      return response.render('admin/chefs/create', {error})
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

	 return response.render('admin/animation/sucess')
      }catch(err){
	 console.error(err)
      }
   },
   async show(request, response){
      try{
	 const error = request.session.error
	 request.session.error = ''
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
	 chefs.recipeCount = recipesChefs.length

	 return response.render('admin/chefs/show', {chefs, recipesChefs, error})
      }catch(err){
	 console.error(err)
      }
   },
   async edit(request, response){
      try{
	 const error = request.session.error
	 request.session.error = ''
	 let chefs = await LoadChef.load('chef', {where: {id: request.params.id}})

	 return response.render('admin/chefs/edit', {chefs, error})
      }catch(err){
	 console.error(err)
      }
   },
   async put(request, response){
      try{
	 const file = request.file
	 if(file != undefined){
	    const fileid = await File.create({name: file.filename, path: file.path})
	    await Chef.update(request.body.id, {
	       name: request.body.name,
	       file_id: fileid
	    })
	 }
	 await Chef.update(request.body.id, {
	    name: request.body.name
	 })
	 

	 if(request.body.removed_files){
	    const removedFile = request.body.removed_files.split(',')
	    let file = removedFile[0]
	    file = await File.find(file)
	    unlinkSync(file.path)
	    await File.delete(file.id)
	 }

	 return response.render('admin/animation/update')
	 	 
      }catch(err){
	 console.error(err)
      }
   },
   async delete(request, response){
      try{
	 const chef = await Chef.find(request.body.id)
	 const file = await Chef.file(chef.file_id)
	 await Chef.delete(request.body.id)
	 unlinkSync(file[0].path)
	 await File.delete(file[0].id)

	 return response.render('admin/animation/delete')
      }catch(err){
	 console.error(err)
      }
   }
}
