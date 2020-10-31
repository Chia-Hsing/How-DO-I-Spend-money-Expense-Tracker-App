const express = require('express')
const timeFormat = require('../utils/date')
const passport = require('passport')

const router = new express.Router()

router.get('/facebook', passport.authenticate('facebookLogin', { scope: ['email'] }))

router.get(
    '/facebook/callback',
    passport.authenticate('facebookLogin', {
        failureRedirect: '/user/login',
        failureFlash: true,
    }),
    (req, res) => {
        const formatDate = timeFormat()
        return res.redirect(`/expense?date=${formatDate}`)
    }
)

module.exports = router
