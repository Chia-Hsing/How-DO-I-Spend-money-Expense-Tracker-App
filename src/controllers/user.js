const User = require('../models/user')
const { validationResult } = require('express-validator')
const crypto = require('crypto')
const sendResetPWEmail = require('../utils/sendMail')

// get signup page
const getSignup = (req, res) => {
    res.render('signup', {
        // should signup stylesheet and validation function apply?
        formCSS: true,
        validationFormJS: true,
        decorationOneCSS: true,
    })
}

// get login page
const getLogin = (req, res) => {
    res.render('login', {
        // should login stylesheet and validation function apply?
        formCSS: true,
        validationFormJS: true,
        decorationTwoCSS: true,
    })
}

// Passport provide the logout() function which can remove the req.user property from request Object and clear the login session.
const getLogout = (req, res) => {
    req.logout()
    return res.redirect('/user/login')
}

// get reset password page
const getResetPassword = async (req, res) => {
    res.render('resetPW', {
        formCSS: true,
        validationFormJS: true,
        decorationOneCSS: true,
    })
}

const getNewPassword = async (req, res) => {
    const token = req.params.token

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    }).lean()

    if (!user) {
        req.flash('refuse', 'Password reset token is invalid or has expired.')
        return res.redirect('/user/resetPW')
    }

    res.render('newPW', {
        formCSS: true,
        validationFormJS: true,
        decorationTwoCSS: true,
        user,
    })
}

// user signup handler
const postSignup = async (req, res) => {
    // create a new user instance
    const user = new User({ ...req.body })
    // get error Object from express-validator
    const result = validationResult(req)
    const { username, email, password, password__recheck } = user

    // use isEmpty method from express-validator to determine whether error Object is empty
    if (!result.isEmpty()) {
        return res.status(400).render('signup', {
            formCSS: true,
            validationFormJS: true,
            signUpDecorationCSS: true,
            // array(): one of the methods of express-validator
            errors: result.array(),
            // represent the same input value after submit
            user: { username, email, password, password__recheck },
        })
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            req.flash('warning', 'Email address already exist, please log in!')
            return res.redirect('/user/login')
        }
        req.flash('success', 'Sign up success!')
        // save user from request to database
        await user.save()
        return res.status(201).redirect('/user/login')
    } catch (e) {
        res.status(404).send(e)
        return res.redirect('/user/signup')
    }
}

const postResetPassword = async (req, res) => {
    try {
        // crypto library is part of Node.js. We will be using it for generating random token during a password reset.
        const buf = crypto.randomBytes(20)
        const token = buf.toString('hex')

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            req.flash('refuse', 'This email address does not be register before, please sign up!')
            return res.redirect('/user/signup')
        }

        user.resetPasswordToken = token
        // expired after 10 minutes
        user.resetPasswordExpires = Date.now() + 600000

        await user.save()

        const sender = 'ausgeflippte@gmail.com'
        const receiver = user.email
        sendResetPWEmail(sender, receiver, token)

        req.flash('success', `An email has been sent to ${user.email}.`)
        return res.redirect('/user/login')
    } catch (e) {
        res.status(400).send(e)
        return res.redirect('/user/login')
    }
}

const postNewPassword = async (req, res) => {
    const { password, userID } = req.body
    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.render('/user/newPW', {
            formCSS: true,
            validationFormJS: true,
            decorationTwoCSS: true,
            errors: result.array(),
        })
    }

    try {
        const user = await User.findOne({
            _id: userID,
            resetPasswordExpires: { $gt: Date.now() },
        })

        if (!user) {
            req.flash('refuse', 'Password reset token is invalid or has expired.')
            return res.redirect('/user/login')
        }

        user.password = password
        user.resetPasswordToken = null
        user.resetPasswordExpires = null

        await user.save()
        req.flash('success', 'The password has been reset successfully!')
        return res.redirect('/user/login')
    } catch (e) {
        res.status(400).send(e)
        return res.redirect('/user/login')
    }
}

module.exports = {
    postSignup,
    postNewPassword,
    postResetPassword,
    getSignup,
    getLogin,
    getLogout,
    getNewPassword,
    getResetPassword,
}
