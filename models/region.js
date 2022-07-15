const mongoose = require('./connection')
const { Schema, model } = mongoose
const regionSchema = new Schema({
    RegionName: String
}, {
    timestamps: true
})
const Region = model('Region', regionSchema)
module.exports = Region 