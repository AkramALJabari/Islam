const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  Ahadeth: Array,
})

module.exports = mongoose.model('Ahadeth', Schema)