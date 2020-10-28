const express = require('express')
const userController = require('../controllers/user')
const passport = require('passport')
const { body } = require('express-validator')
const date = require('../utils/date')

const router = new express.Router()

router.get('/signup', userController.getSignup)
router.get('/login', userController.getLogin)
router.get('/logout', userController.getLogout)

router.post(
    '/signup',
    [
        body('username').trim().isLength({ min: 1 }).withMessage('Username must be required!'),
        body('email').trim().isEmail().withMessage('Invalid email address!'),
        body('password').custom(value => {
            const regex = /^\S{8,12}$/
            const PWCheck = value.match(regex)
            if (!PWCheck) {
                throw new Error('Invalid password!')
            }
            // if pass the validation, must return true
            return true
        }),
        body('password__recheck').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password__recheck invalid')
            }
            return true
        }),
    ],
    userController.postSignup
)

//By default, if authentication fails, Passport will respond with a 401 Unauthorized status, and any additional route handlers will not be invoked. If authentication succeeds, the next handler will be invoked and the req.user property will be set to the authenticated user.
const formatDate = date()

router.post(
    '/login',
    passport.authenticate('login', {
        successRedirect: `/expense?date=${formatDate}`,
        failureRedirect: '/user/login',
        failureFlash: true,
    })
)

module.exports = router
