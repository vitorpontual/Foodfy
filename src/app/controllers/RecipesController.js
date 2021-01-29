const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')
const File = require('../models/File')
const LoadRecipe = require('../services/LoadRecipeService')
const fs = require('fs')
const {date} = require('../../lib/utils')

module.exports = {
   async index(request, response){
      let {page, limit} = request.query

      page = page || 1
      limit = limit || 6
      let offset = limit * ( page - 1 )

      const params = {
	 page, limit, offset
      }
      let recipes = await Recipe.paginate(params)
      const recipesPromise = recipes.map(LoadRecipe.format)

      recipes = await Promise.all(recipesPromise)

      if(recipes == 0){
	 return response.render('admin/recipes/index')
      }

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
	 const error = request.session.error
	 request.session.error = ''

	 const chefsOption = await Chef.findAll()

	 return response.render('admin/recipes/edit', {chefsOption, recipes, error})
      }catch(err){
	 console.error(err)
      }
   },
   async create(request, response){
      try{
	 let chefsOption = await Chef.findAll()
	 const error = request.session.error
	 request.session.error = ''
	 const body = request.session.body
	 request.session.body = ''
	 return response.render('admin/recipes/create', {chefsOption, error, body})

      }catch(err){
	 console.error(err)
      }
   },
   async post(request, response){
      try{
	 let {chef_id, title, ingredients, preparations, information, user_id} = request.body

	 const recipe = await Recipe.create({
	    chef_id,
	    title,
	    ingredients: `{${ingredients}}`,
	    preparations: `{${preparations}}`,
	    information,
	    user_id: request.session.userId,
	    created_at: date(Date.now()).iso
	 })

	 const filePromise = request.files.map(file => File.createRecipeFiles({
	    name: file.filename, path: file.path, recipe_id: recipe
	 }))
	 const files = await Promise.all(filePromise)
	 console.log(files)

	 return response.render('admin/animation/sucess')
      }catch(err){
	 console.error(err)
      }
   },
   async put(request, response){
      try{
	 if (request.files.length != 0){
	    const newFilesPromise = request.files.map(file => {
	       File.createRecipeFiles({name: file.filename, path: file.path, recipe_id: request.body.id})
	    })
	    await Promise.all(newFilesPromise)
	 }

	 if(request.body.removed_files){
	    const removedFiles = request.body.removed_files.split(',')
	    const lastIndex = removedFiles.length - 1
	    removedFiles.splice(lastIndex, 1)

	    const removedFilesPromise = removedFiles.map(async id =>{
	       const file = await File.find(id)
	       try{
		  fs.unlinkSync(file.path)
	       }catch(err){
		  console.error(err)
	       }
	       await File.delete(id)
	    })
	 }

	 let { chef_id, title, ingredients, preparations, information } = request.body

	 await Recipe.update(request.body.id, {
	    chef_id,
	    title,
	    ingredients: `{${ingredients}}`,
	    preparations: `{${preparations}}`,
	    information,
	 })

	 return response.render('admin/animation/update')
	 
      }catch(err){
	 console.error(err)
      }
   },
   async delete(request, response){
      try{

	 const files = await Recipe.file(request.body.id)
	 files.map(async file => {
	    fs.unlinkSync(file.path)
	    await File.delete(file.file_id)
	 })
	 await Recipe.delete(request.body.id)


	 return response.render('admin/animation/delete')
      }catch(err){
	 console.error(err)
      }
   }
}
