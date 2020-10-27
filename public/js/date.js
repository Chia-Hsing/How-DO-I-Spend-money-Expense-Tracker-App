const moment = require('moment')

const timeFormat = () => {
    const date = new Date()
    return moment(date).format('YYYY-MM-DD')
}

module.exports = timeFormat
