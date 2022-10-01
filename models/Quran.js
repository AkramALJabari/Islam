const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  Quran: Array,
})

module.exports = mongoose.model('Quran', Schema)