const mongoose = require('./connection')
const { Schema, model } = mongoose
const regionSchema = new Schema({
    regionName: String,
    owner: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
}, {
    timestamps: true
})
const Region = model('Region', regionSchema)
module.exports = Region 