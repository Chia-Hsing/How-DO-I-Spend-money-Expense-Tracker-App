const LocalStrategy = require('passport-local').Strategy
const bcryptjs = require('bcryptjs')
const User = require('../../src/models/user')

module.exports = passport => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                User.findOne({ email: username }, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    if (!user) {
                        return done(null, false, req.flash('warning', 'Invalid email address or password!'))
                    }

                    const isMatch = bcryptjs.compare(password, user.password)

                    if (isMatch) {
                        return done(null, user)
                    }

                    return done(null, false, req.flash('warning', 'Invalid email address or password!'))
                })
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, user => {
            done(null, user)
        })
    })
}
