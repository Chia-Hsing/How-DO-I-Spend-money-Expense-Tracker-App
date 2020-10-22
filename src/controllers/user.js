const User = require('../models/user')

const postSignup = async (req, res) => {
    const user = new User({ ...req.body })
    try {
        await User.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
}

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

const getSignup = async (req, res) => {}
const getLogin = async (req, res) => {}
const getLogout = async (req, res) => {}
const getNewPassword = async (req, res) => {}
const getResetPassword = async (req, res) => {}

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
