const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

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

    passport.use(
        'facebookLogin',
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.SERVER_API_URL + '/auth/facebook/callback',
                profileFields: ['displayName', 'email'],
            },
            async (accessToken, refreshToken, profile, done) => {
                let user
                try {
                    user = await User.findOne({ email: profile._json.email })

                    // if user did not sign up before
                    if (!user) {
                        const username = profile._json.name
                        const email = profile._json.email
                        // create a random string which characters are in 1~9 and a~z.
                        const pw = Math.random().toString(36).substr(2, 4) + Date.now().toString(36).substr(3, 4)
                        // create a hash value for the password, and use a callback function to set the user's profile
                        bcrypt.hash(pw, 8, (err, hash) => {
                            const newUser = new User({ username, email, password: hash })
                            newUser.save().then(user => done(null, user))
                        })
                        return
                    }

                    return done(null, user)
                } catch (e) {
                    return done(e, false)
                }
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
