const Handlebars = require('handlebars')

Handlebars.registerHelper('isSelected', (selectedCategory, option) => {
    return selectedCategory === option ? 'selected' : ''
})
