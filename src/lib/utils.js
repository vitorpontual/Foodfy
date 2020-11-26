module.exports = {
   date(timestamp){
      const date = new Date(timestamp)

      const year = date.getUTCFullYear()
      const month = `0${date.getUTCMonth() + 1}`.slice(-2)
      const day = `0${date.getUTCDate()}`.slice(-2)

      return  {
	 day,
	 month,
	 year,
	 iso: `${year}-${month}-${day}`,
	 birthDay: `${day}/${month}`,
	 format: `${day}/${month}/${year}`
      }
   },
   randomPassword(length){
      let results = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let charactersLength = characters.length

      for(let i = 0; i < length; i++){
	 results += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return results
   }
}


