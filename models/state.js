const mongoose = require('./connection')
const { Schema, model } = mongoose
const stateSchema = new Schema({
name: String,
code: String
})
const State = model('State', stateSchema)
module.exports = State 