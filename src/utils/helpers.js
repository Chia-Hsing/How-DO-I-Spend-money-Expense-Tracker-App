const Handlebars = require('handlebars')
const timeFormat = require('../utils/date')

Handlebars.registerHelper('isSelected', (selectedCategory, option) => {
    return selectedCategory === option ? 'selected' : ''
})

Handlebars.registerHelper('formatDate', date => {
    return timeFormat(date)
})
