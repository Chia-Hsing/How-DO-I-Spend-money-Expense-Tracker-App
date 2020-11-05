const methodOverride = (req, res, next) => {
    if (req.body && typeof req.body === 'object' && '__method' in req.body) {
        req.method = req.body.__method
    }
    next()
}

module.exports = methodOverride
