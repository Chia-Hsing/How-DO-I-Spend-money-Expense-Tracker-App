const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validator(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Your email address is invalid!')
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: 10,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)

module.exports = User
