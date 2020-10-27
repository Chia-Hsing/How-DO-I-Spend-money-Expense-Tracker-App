const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../../src/models/user')

module.exports = passport => {
    passport.use(
        'login',
        // LocalStrategy's middleware will looking for req.body || req.query || username || password to get information of users.
        new LocalStrategy(
            {
                // verify the email field instead of the username.
                usernameField: 'email',
                // use request object in this strategy.
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                User.findOne({ email: username }, (err, user) => {
                    if (err) {
                        return done(err)
                    }
                    if (!user) {
                        return done(null, false, req.flash('warning', 'Email address does not exist, please sign up!'))
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (isMatch) {
                            return done(null, user)
                        }
                        return done(null, false, req.flash('warning', 'Invalid email address or password!'))
                    })
                })
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
