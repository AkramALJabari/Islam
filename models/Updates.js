const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    Updates: Array,
})

module.exports = mongoose.model('Updates', Schema)