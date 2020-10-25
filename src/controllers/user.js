const User = require('../models/user')
const { validationResult } = require('express-validator')

const getSignup = (req, res) => {
    res.render('signup', {
        // should signup stylesheet apply?
        validationFormCSS: true,
    })
}
const getLogin = async (req, res) => {
    res.render('login', {
        // should signup stylesheet apply?
        validationFormCSS: true,
    })
}
const getLogout = async (req, res) => {
    req.logout()
}
const getNewPassword = async (req, res) => {}
const getResetPassword = async (req, res) => {}

// user signup handler -------------------
const postSignup = async (req, res) => {
    // create a new user instance
    const user = new User({ ...req.body })
    // get error Object from express-validator
    const result = validationResult(req)

    const { username, email, password, password__recheck } = user
    // use isEmpty method from express-validator to determine whether error Object is empty
    if (!result.isEmpty()) {
        return res.status(400).render('signup', {
            validationFormCSS: true,
            errors: result.array(),
            // represent the same input value after submit
            user: { username, email, password, password__recheck },
        })
    }

    try {
        const email = await User.findOne({ email: req.body.email })
        if (email) {
            return res.status(400).send('Email address already existed!')
        }

        // save user from request to database
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
}
// ----------------------------------------

const postLogin = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.status(200).send(user)
    } catch (e) {
        req.status(400).send(e)
    }
}

const postLogout = async (req, res) => {}
const postNewPassword = async (req, res) => {}
const postResetPassword = async (req, res) => {}

module.exports = {
    postSignup,
    postLogin,
    postLogout,
    postNewPassword,
    postResetPassword,
    getSignup,
    getLogin,
    getLogout,
    getNewPassword,
    getResetPassword,
}
