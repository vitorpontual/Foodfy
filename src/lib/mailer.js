const nodemailer = require('nodemailer')
require('dotenv/config')

const key = process.env.API_KEY
const pass = process.env.TOKEN

module.exports = nodemailer.createTransport({
     host: "smtp.mailtrap.io",
     port: 2525,
     auth: {
      user: `${key}`,
      pass: `${pass}`
  }
})
