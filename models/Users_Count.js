const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  ID: String,
  Users: Array,
})

module.exports = mongoose.model('Users_Count', Schema)