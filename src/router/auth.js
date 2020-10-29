const express = require('express')
const timeFormat = require('../utils/date')
const passport = require('passport')

const router = new express.Router()

router.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }))

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/user/login',
    }),
    (req, res) => {
        const formatDate = timeFormat()
        return res.redirect(`/expense?date=${formatDate}`)
    }
)

module.exports = router
