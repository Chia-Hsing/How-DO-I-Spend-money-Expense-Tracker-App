const path = require('path')
const express = require('express')
const userRouter = require('./router/user')
const expenseRouter = require('./router/expense')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const connectFlash = require('connect-flash')
const exphbs = require('express-handlebars')

// passport strategies configuration
require('../config/passport')(passport)
// database connection
require('./db/mongoose')

const app = express()

// handlebars initial setting
const viewsPath = path.join(__dirname, 'views')
const partialsPath = path.join(__dirname, 'views/partials')
app.engine(
    'handlebars',
    exphbs({
        layoutsDir: viewsPath,
        partialsDir: partialsPath,
        defaultLayout: 'main',
    })
)
app.set('view engine', 'handlebars')

// use static files
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

// use express-session
app.use(
    session({
        secret: 'goaheadluckyboy',
        resave: false,
        saveUninitialized: false,
    })
)

// parse requests where the Content-Type is application/json
app.use(bodyParser.json())
// parse requests where the Content-Type is application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// passport session initialized
app.use(passport.initialize())
app.use(passport.session())

// routers
app.use('/expense', expenseRouter)
app.use('/user', userRouter)

// use connect-flash in order to store message in the session for later display to the client
app.use(connectFlash())

module.exports = app
