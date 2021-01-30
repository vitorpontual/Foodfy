const Recipe = require('../models/Recipe')
const Chef = require('../models/Chef')

async function getImages(recipeId){
   let files = await Recipe.file(recipeId)
   files = files.map(file => ({
      id: file.file_id,
      name: file.name,
      src: `${file.path.replace('public', '')}`
   }))

   return files
}
async function formatComma(array){
   const arrayPromise = array.map(arr => {
      arr = arr.replace(/,/g, ";")
      return arr
   })
   array = await Promise.all(arrayPromise)
   return array
}

async function format(recipe){
   const chef = await Chef.find(recipe.chef_id)
   const files = await getImages(recipe.id)
   recipe.img = files[0].src
   recipe.files = files
   recipe.chef = chef.name

   const ingredientPromise = recipe.ingredients.map(r => {
      r = r.replace(/;/g, ',')
      return r
   })
   recipe.ingredients = await Promise.all(ingredientPromise)

   const preparationsPromise = recipe.preparations.map(p => {
      p = p.replace(/;/g, ',')
      return p
   })
   recipe.preparations = await Promise.all(preparationsPromise)
   return recipe
}

const LoadService = {
   load(service, filter){
      this.filter = filter
      return this[service]()
   },
   async recipe(){
      try{
	 const recipe = await Recipe.findOne(this.filter)
	 return format(recipe)
      }catch(err){
	 console.error(err)
      }
   },
   async recipes(){
      try{
	 const recipes = await Recipe.findAll(this.filter)
	 const recipesPromise = recipes.map(format)

	 return Promise.all(recipesPromise)
      }catch(err){
	 console.error(err)
      }
   },
   format,
   async formatComma(){
      try{
	 const change = await formatComma(this.filter)
	 return change
      }catch(err){
	 console.error(err)
      }
   }
}

module.exports = LoadService
