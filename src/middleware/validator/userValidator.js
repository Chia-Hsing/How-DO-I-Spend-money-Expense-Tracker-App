const { body } = require('express-validator')

const userSignupCheck = [
    body('username').trim().isLength({ min: 1 }).withMessage('Username must be required!'),
    body('email').trim().isEmail().withMessage('Invalid email address!'),
    body('password').custom(value => {
        const regex = /^\S{8,12}$/
        const PWCheck = value.match(regex)
        if (!PWCheck) {
            throw new Error('Invalid password!')
        }
        body('password__check').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password__check invalid')
            }
            return true
        })
    }),
]

module.exports = {
    userSignupCheck,
}
