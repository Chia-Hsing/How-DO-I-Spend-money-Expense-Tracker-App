const Expense = require('../models/expense')
const User = require('../models/user')

const getHomepage = (req, res) => {
    res.render('homepage', { signUpDecorationCSS: true })
}

module.exports = {
    getHomepage,
}
