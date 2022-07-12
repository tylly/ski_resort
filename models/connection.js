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
mongoose.connect(DATABASE_URI, config)

mongoose.connection
// handle the opnening of the connection
//running code block on open
//console.logging a string
    .on('open', () => console.log('connected to mongoose'))
//since we have opened a connection, we have to close it
    .on('close', () => console.log('disconnected from Mongoose'))
//handle any errors
// running a code block on error using console.error to see that error
    .on('error', err => console.error(err))

module.exports = mongoose