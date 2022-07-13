require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const app = require('liquid-express-views')(express())
app.use(methodOverride('_method'))
const userRoutes = require('./controller/user_routes')
const resortRoutes = require('./controller/resort_routes')
app.use(express.urlencoded({ extended: false }))
const session = require('express-session')
app.use(express.static('public'))
const MongoStore = require('connect-mongo')

app.use(
	session({
		secret: process.env.SECRET,
		store: MongoStore.create({
			mongoUrl: process.env.DATABASE_URI
		}),
		saveUninitialized: true,
		resave: false
	})
)
app.get('/', (req, res) => {
    res.send('hooked')
})



app.use('/users', userRoutes)
app.use('/resorts', resortRoutes)


const DATABASE_URI = process.env.DATABASE_URI
const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`app is listening on port: ${PORT}`)
    console.log(DATABASE_URI)
})