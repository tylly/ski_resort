const mongoose = require('./connection')
const { Schema, model } = mongoose
const backgroundSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    }
})
const Background = model('Background', backgroundSchema)
module.exports = Background 