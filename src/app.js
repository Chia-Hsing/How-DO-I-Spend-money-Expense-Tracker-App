const path = require('path')
const express = require('express')
const userRouter = require('./router/user')
const expenseRouter = require('./router/expense')
require('./db/mongoose')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use('/expense', expenseRouter)
app.use('/user', userRouter)

module.exports = app
