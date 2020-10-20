const path = require('path')
const express = require('express')
const expenseRouter = require('./router/expense')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(expenseRouter)

module.exports = app
