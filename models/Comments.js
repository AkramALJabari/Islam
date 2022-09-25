const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  Comments: Array,
})

module.exports = mongoose.model('Comments', Schema)