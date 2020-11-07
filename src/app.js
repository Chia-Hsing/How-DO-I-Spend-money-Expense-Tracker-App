const path = require('path')
const express = require('express')
const userRouter = require('./router/user')
const expenseRouter = require('./router/expense')
const authRouter = require('./router/auth')
const summaryRouter = require('./router/summary')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const timeFormat = require('./utils/date')

// database connection
require('./db/mongoose')
// passport strategies configuration
require('./middleware/passport')(passport)

const app = express()

// handlebars initialized setting
const viewsPath = path.join(__dirname, './views')
app.engine(
    'handlebars',
    exphbs({
        helpers: {
            isSelected: (selectedCategory, option) => {
                return selectedCategory === option ? 'selected' : ''
            },
            formatDate: date => {
                return timeFormat(date)
            },
            isToday: (todayDate, otherDate) => {
                if (todayDate !== otherDate) {
                    return otherDate
                } else {
                    return 'Today'
                }
            },
            categoryIcon: category => {
                switch (category) {
                    case 'food':
                        return `<span class="iconify" data-icon="mdi:food-variant" data-inline="false"></span>`
                    case 'entertaining':
                        return `<span class="iconify" data-icon="ri:user-smile-fill" data-inline="false"></span>`
                    case 'clothes':
                        return `<span class="iconify" data-icon="maki:clothing-store-15" data-inline="false"></span>`
                    case 'knowledge':
                        return `<span class="iconify" data-icon="ic:baseline-menu-book" data-inline="false"></span>`
                    case 'transportation':
                        return `<span class="iconify" data-icon="ic:round-directions-transit" data-inline="false"></span>`
                    case 'home_supplies':
                        return `<span class="iconify" data-icon="mdi:bottle-tonic" data-inline="false"></span>`
                    case 'healthcare':
                        return `<span class="iconify" data-icon="medical-icon:health-services" data-inline="false"></span>`
                    case 'housing':
                        return `<span class="iconify" data-icon="ic:sharp-house" data-inline="false"></span>`
                }
            },
        },
    })
)
app.set('view engine', 'handlebars')
app.set('views', viewsPath)

// use static files
const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

// use express-session
app.use(
    session({
        // session ID cookie signature
        secret: 'goaheadluckyboy',
        // determine if the session be stored even though it did not be changed.
        resave: false,
        // mandatorily store the session uninitialized
        saveUninitialized: false,
    })
)

// parse requests where the Content-Type is application/json
app.use(bodyParser.json())
// parse requests where the Content-Type is application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// passport session initialized setting
app.use(passport.initialize())
app.use(passport.session())

// use connect-flash in order to store message in the session for later display to the client
app.use(flash())

// The res.locals property is an object that contains response local variables scoped to the request and because of this, it is only available to the view(s) rendered during that request/response cycle (if any).
app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.today = timeFormat()
    res.locals.warning = req.flash('warning')
    res.locals.success = req.flash('success')
    res.locals.refuse = req.flash('refuse')
    next()
})

// routers
app.use('/expense', expenseRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/summary', summaryRouter)

module.exports = app

// reset pw
// csrf
