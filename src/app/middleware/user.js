const Recipe = require('../models/recipe')

async function verifyEdit(request, response, next){
   const { id } = request.params

   const recipe = await Recipe.findOne(id)
   const allRecipes = await Recipe.all()

   async function getImage(recipeId){
      let results = await Recipe.files(recipeId)
      const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

      return files[0]
   }

   const recipePromise = allRecipes.map( async recipe => {
      recipe.img = await getImage(recipe.id)

      return recipe
   } )

   const recipes = await Promise.all(recipePromise)

   if(recipe.user_id != request.session.userId || !request.session.isAdmin){
      return response.render('admin/recipes/index', {
	 recipes,
	 error: 'Sem permissão para editar!'
      })
   }

   next()
}

module.exports = {
   verifyEdit
}
