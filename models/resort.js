const mongoose = require('./connection')
const { Schema, model } = mongoose
const resortSchema = new Schema({
    resortName: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId, //a single User ._id field
        ref: 'User', 
        required: true
    },
    logo: String,
    avgBaseDepthMin: String,
    avgBaseDepthMax: String,
    primarySurfaceCondition: String,
    openDownHillTrail: Number,
    terrainParksOpen: Number,

}, {
    timestamps: true
})
const Resort = model('Resort', resortSchema)
module.exports = Resort 