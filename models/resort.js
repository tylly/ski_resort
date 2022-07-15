const mongoose = require('./connection')
const { Schema, model } = mongoose
const resortSchema = new Schema({
    resortName: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    resortId: {
        type: String,
        required: true
    },
    logo: String,
    avgBaseDepthMin: String,
    avgBaseDepthMax: String,
    primarySurfaceCondition: String,
    openDownHillTrails: Number,
    maxOpenDownHillTrails: Number,
    openDownHillLifts: Number,
    maxOpenDownHillLifts: Number,
    terrainParkOpen: String,

}, {
    timestamps: true
})
const Resort = model('Resort', resortSchema)
module.exports = Resort 