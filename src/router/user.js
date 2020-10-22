const express = require('express')
const userController = require('../controllers/user')
const { body } = require('express-validator')
const passport = require('passport')

const router = new express.Router()

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
        body('password__check').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password__check invalid')
            }
            return true
        }),
    ],
    userController.postSignup
)
router.post(
    '/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/',
            failureRedirect: '/users/login',
            failureFlash: true,
        },
        () => {
            console.log('success')
        }
    ),
    userController.postLogin
)

module.exports = router
