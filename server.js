require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const app = require('liquid-express-views')(express())
app.use(methodOverride('_method'))
const userRoutes = require('./controller/user_routes')
const resortRoutes = require('./controller/resort_routes')
const regionRoutes = require('./controller/region_routes')
app.use(express.urlencoded({ extended: false }))
const session = require('express-session')
app.use(express.static('public'))
const MongoStore = require('connect-mongo')

app.use(
	session({
		secret: process.env.SECRET,
		store: MongoStore.create({
			mongoUrl: process.env.MONGODB_URI
		}),
		saveUninitialized: true,
		resave: false
	})
)
app.get('/', (req, res) => {
    res.redirect('http://localhost:3000/resorts/home')
})



app.use('/users', userRoutes)
app.use('/resorts', resortRoutes)
app.use('/regions', regionRoutes)


const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
app.listen(process.env.PORT || 3000, () => {
	console.log(`app is listening on port: ${PORT}`)
    console.log(MONGODB_URI)
})