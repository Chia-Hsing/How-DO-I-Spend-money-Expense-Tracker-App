const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// transform password from string to hash before the data stored to database
userSchema.pre('save', async function () {
    const user = this
    user.password = await bcryptjs.hash(user.password, 8)
})

const User = mongoose.model('User', userSchema)

module.exports = User
