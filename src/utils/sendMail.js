const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')

const sendResetPWEmail = (sender, receiver, token) => {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
        },
    }

    let transporter = nodemailer.createTransport(sgTransport(options))

    let link = process.env.SERVER_API_URL + `/user/newPW/${token}`

    transporter.sendMail({
        to: receiver,
        from: sender,
        subject: 'Reset your password',
        html: `<p>Hello! reset your password by click this <a href=${link}>link</a></p>`,
    })
}

module.exports = sendResetPWEmail
