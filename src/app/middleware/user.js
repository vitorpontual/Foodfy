const Recipe = require('../models/Recipe')
const LoadRecipe = require('../services/LoadRecipeService')

async function verifyEdition(request, response, next) {
    const recipe = await LoadRecipe.load('recipe', { where: { id: request.params.id } })

    const recipes = await LoadRecipe.load('recipes')
    console.log(request.headers.referer)

    if (recipe.user_id != request.session.userId && request.session.isAdmin == false) {
        request.session.error = 'Você não está autorizado a editar receita de outros usúarios.'
        console.log(request.session)
        return response.redirect(`${request.headers.referer}`)
    }
    next()
}


module.exports = {
    verifyEdition,
}