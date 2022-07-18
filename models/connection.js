require('dotenv').config()
const mongoose = require('mongoose')
const DATABASE_URI = process.env.DATABASE_URI
const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(DATABASE_URI, config)
mongoose.connection
    .on('open', () => console.log('connected to mongoose'))
    .on('close', () => console.log('disconnected from Mongoose'))
    .on('error', err => console.error(err))

module.exports = mongoose