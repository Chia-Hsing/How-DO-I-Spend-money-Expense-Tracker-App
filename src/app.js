const path = require('path')
const express = require('express')
const userRouter = require('./router/user')
const expenseRouter = require('./router/expense')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
require('./db/mongoose')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use('/expense', expenseRouter)
app.use('/user', userRouter)
app.use(passport.initialize())
app.use(passport.session())

passport.use(
    new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false)
            }
            if (!user.verifyPassword(password)) {
                return done(null, false)
            }
            return done(null, user)
        })
    })
)

module.exports = app
