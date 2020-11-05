const User = require('../models/user')
const { validationResult } = require('express-validator')

// get signup page
const getSignup = (req, res) => {
    res.render('signup', {
        // should signup stylesheet and validation function apply?
        formCSS: true,
        validationFormJS: true,
        signUpDecorationCSS: true,
    })
}

// get login page
const getLogin = (req, res) => {
    res.render('login', {
        // should login stylesheet and validation function apply?
        formCSS: true,
        validationFormJS: true,
        logInDecorationCSS: true,
    })
}

// Passport provide the logout() function which can remove the req.user property from request Object and clear the login session.
const getLogout = (req, res) => {
    req.logout()
    return res.redirect('/user/login')
}

// const getNewPassword = async (req, res) => {}
// const getResetPassword = async (req, res) => {}

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
        const email = await User.findOne({ email: req.body.email })
        if (email) {
            req.flash('warning', 'Email address already exist, please log in!')
            return res.status(400).redirect('/user/login')
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

// const postNewPassword = async (req, res) => {}
// const postResetPassword = async (req, res) => {}

module.exports = {
    postSignup,
    // postNewPassword,
    // postResetPassword,
    getSignup,
    getLogin,
    getLogout,
    // getNewPassword,
    // getResetPassword,
}
