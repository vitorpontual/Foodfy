const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
     host: "smtp.mailtrap.io",
     port: 2525,
     auth: {
      user: "27cff4e234ace5",
      pass: "2ca0b0863196af"
  }
})
