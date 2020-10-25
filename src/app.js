const path = require('path')
const express = require('express')
const userRouter = require('./router/user')
const expenseRouter = require('./router/expense')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')

// database connection
require('./db/mongoose')
// passport strategies configuration
require('../public/js/passport')(passport)

const app = express()

// handlebars initial setting
const viewsPath = path.join(__dirname, './views')
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.set('views', viewsPath)

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

// use connect-flash in order to store message in the session for later display to the client
app.use(flash())

// passport session initialized
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.reminder = req.flash('warning')
    res.locals.success = req.flash('success')
    next()
})

// routers
app.use('/expense', expenseRouter)
app.use('/user', userRouter)

module.exports = app
