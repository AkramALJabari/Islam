const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  ID: String,
  Ahadeth: Array,
})

module.exports = mongoose.model('Ahadeth', Schema)