const db = require('../../config/db')
const Base = require('./Base')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const { randomPassword } = require('../../lib/utils')

Base.init({table: 'users'})

module.exports = {
   ...Base,
}
