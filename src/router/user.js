const express = require('express')
const userController = require('../controllers/user')
const { userSignupCheck } = require('../middleware/validator/userValidator')

const router = new express.Router()

router.post('/signup', userSignupCheck, userController.postSignup)
router.post('/login', userController.postLogin)

module.exports = router
