const path = require('path')
const express = require('express')
const userRouter = require('./router/user')
const expenseRouter = require('./router/expense')
const authRouter = require('./router/auth')
const summaryRouter = require('./router/summary')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const timeFormat = require('./utils/date')

// database connection
require('./db/mongoose')
// passport strategies configuration
require('./middleware/passport')(passport)

const app = express()

// handlebars initial setting
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

// use connect-flash in order to store message in the session for later display to the client
app.use(flash())

app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.today = timeFormat()
    res.locals.warning = req.flash('warning')
    res.locals.success = req.flash('success')
    next()
})

// routers
app.use('/expense', expenseRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/summary', summaryRouter)

module.exports = app

// monthly search
// chart
// reset pw
// csrf
