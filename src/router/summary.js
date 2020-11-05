const express = require('express')
const summaryController = require('../controllers/summary')
const isAuthenticated = require('../middleware/auth')

const router = new express.Router()

router.get('/', isAuthenticated, summaryController.getSummary)

module.exports = router
