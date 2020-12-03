const Chef = require('../models/chef')
const File = require('../models/file')

exports.index = async function (request, response) {
   let results = await Chef.all()
   const chefs = results.rows

   async function getImage(id){
      let results = await Chef.files(id)
      const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`)

      return files[0]
   }

   const chefPromise = chefs.map( async file => {
      file.img = await getImage(file.file_id)

      return file
   } )

   const chef = await Promise.all(chefPromise)


   return response.render('admin/chefs/index', { chef })
}
exports.create = function (request, response) {
   return response.render('admin/chefs/create')
}
exports.post = async function (request, response) {
   try {

      const keys = Object.keys(request.body)

      for (key in keys) {
         if (request.body[key] == '') return response.send('Please, fill all fields')
      }
      if( request.files.length == 0) return response.send('Please, sent at least one image')

      const filePromise = request.files.map(file => File.create({...file}))
   

      let results = await filePromise[0]
      const fileId = results.rows[0].id

      results = await Chef.create(request.body, fileId)
      const chefId = results.rows[0].id

      return response.redirect(`/admin/chefs/${chefId}`)

   } catch (err) {
      console.log(err)
   }
}
exports.show = async function (request, response) {

   let results = await Chef.find(request.params.id)
   const chefs = results.rows[0]

   if (!chefs) return response.render('admin/chefs/index', {
      error: 'Chef not Found!'
   })

   results = await Chef.files(chefs.file_id)
   const files = results.rows[0]

   chefs.src = `${request.protocol}://${request.headers.host}${files.path.replace('public', '')}`


   results = await Chef.findRecipesChef(chefs.id)

   const recipes = results.rows
   const recipesChefs = recipes.map(recipe => ({
      ...recipe,
      image: `${request.protocol}://${request.headers.host}${recipe.array[0].replace('public', '')}`
   }))


   return response.render('admin/chefs/show', { chefs, recipesChefs })

}
exports.edit = async function (request, response) {
   let results = await Chef.find(request.params.id)
   const chefs = results.rows[0]

   if (!chefs) return response.send("Chefs no found")

   let chef = await Chef.files(chefs.file_id)
   const files = chef.rows.map(file => ({
      ...file,
      src: `${request.protocol}://${request.headers.host}${file.path.replace('public', '')}`
   }))

   return response.render('admin/chefs/edit', { chefs, files})
}
exports.put = async function (request, response) {
   const keys = Object.keys(request.body)

   for (key of keys) {
      if (request.body[key] == '' && key != 'removed_files') return response.send('Please, fill all fields')
   }


   if(request.file != undefined){
      let results = await File.create({...request.file})
      const fileId = results.rows[0].id
      console.log(fileId)

      await Chef.update(request.body, fileId)

   }

   if(request.body.removed_files){
      const removedFile = request.body.removed_files.split(',')
      const file = removedFile[0]
      await File.deleteChefImage(file)
   }



   return response.redirect('/admin/chefs')


}
exports.delete = async function (request, response) {
   try{
      await Chef.delete(request.body.id)

      return response.redirect('/admin/chefs')
   }catch(err){
      console.log(err)
   }
}
