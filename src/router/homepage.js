const express = require('express')
const homepageController = require('../controllers/homepage')
const isAuthenticated = require('../../public/js/auth')

const router = new express.Router()

router.get('/', isAuthenticated, homepageController.getHomepage)

module.exports = router
