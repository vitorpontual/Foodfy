const Chef = require('../models/Chef')

async function getImages(fileId){
   let files = await Chef.file(fileId)
   files = files.map(file => ({
      ...files,
      src: `${file.path.replace('public', '')}`
   }))
   return files
}

async function format(chef){
   const files = await getImages(chef.file_id)
   chef.img = files[0].src
   chef.files = files
   return chef 
}

const LoadService = {
   load(service, filter){
      this.filter = filter
      return this[service]()
   },
   async chef(){
      try{
	 const chef = await Chef.findOne(this.filter)
	 return format(chef)
      }catch(err){
	 console.error(err)
      }
   },
   async chefs(){
      try{
	 const chefs = await Chef.findAll(this.filter)
	 const chefsPromise = chefs.map(format)

	 return Promise.all(chefsPromise)
      }catch(err){
	 console.error(err)
      }

   }
}

module.exports = LoadService
