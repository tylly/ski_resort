//requiring .env package so we can get things out of our env file
require('dotenv').config()
//getting mongoose to use
const mongoose = require('mongoose')

const DATABASE_URI = process.env.DATABASE_URI

const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// connecting our mongoDB to mongoose
mongoose.connect('mongodb://127.0.0.1/ski_resort', config)

mongoose.connection

    .on('open', () => console.log('connected to mongoose'))
    .on('close', () => console.log('disconnected from Mongoose'))
    .on('error', err => console.error(err))

module.exports = mongoose