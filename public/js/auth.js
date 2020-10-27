module.exports = (req, res, next) => {
    // passport provide isAuthenticated method on request Object, which will return a boolean that represents whether the user is authenticated.
    if (!req.isAuthenticated()) {
        req.flash('warning', 'Please log in first!')
        return res.redirect('/user/login')
    }
    next()
}
