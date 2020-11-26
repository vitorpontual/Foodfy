const Chef = require('../models/chef')
const File = require('../models/file')

exports.index = async function (request, response) {
   let results = await Chef.all()
   const chefs = results.rows
   return response.render('admin/chefs/index', { chefs })
}
exports.create = function (request, response) {
   return response.render('admin/chefs/create')
}
exports.post = async function (request, response) {
   try {

      const keys = Object.keys(request.body)
      console.log(keys)

      for (key in keys) {
         if (request.body[key] == '') return response.send('Please, fill all fields')
      }
      if( request.files.length == 0) return response.send('Please, sent at least one image')

      const filePromise = request.files.map(file => File.create({...file}))
   

      let results = await filePromise[0]
      const fileId = results.rows[0].id

      results = await Chef.create(requeset.body, fileId)
      const chefId = aresults.rows[0].id

      return response.redirect(`/admin/chefs/${chefId}`)

   } catch (err) {
      console.log(err)
   }
}
exports.show = async function (request, response) {

   let results = await Chef.find(request.params.id)
   const chefs = results.rows[0]


   if (!chefs) return response.send('Chef not found')

   results = await Chef.findRecipesChef(chefs.id)
   const recipes = results.rows

   console.log(recipes)


   const recipesChefs = recipes.map(recipe => ({
      ...recipe,
      image: `${request.protocol}://${request.headers.host}${recipe.array[0].replace('public', '')}`
   }))

   return response.render('admin/chefs/show', { chefs, recipesChefs })

}
exports.edit = async function (request, response) {
   let results = await Chef.find(request.params.id)
   const chefs = results.rows[0]
   console.log(chefs)

   if (!chefs) return response.send("Chefs no found")

   let avatar = await Chef.files(chefs.file_id)
   avatar = avatar.rows.map(file => ({
      ...file,
      src: `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`
   }))


   return response.render('admin/chefs/edit', { chefs })
}
exports.put = function (request, response) {
   const keys = Object.keys(request.body)

   for (key of keys) {
      if (request.body[key] == '') return response.send('Please, fill all fields')
   }

   Chef.update(request.body, function () {
      return response.redirect(`/admin/chefs/${request.body.id}`)
   })
}
exports.delete = function (request, response) {
   Chef.delete(request.body.id, function () {
      return response.redirect('/admin/chefs')
   })
}
