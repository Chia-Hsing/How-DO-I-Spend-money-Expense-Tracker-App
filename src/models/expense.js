const mongoose = require('mongoose')
const validator = require('validator')

const expenseSchema = new mongoose.Schema({
    expense: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        validator(value) {
            if (value < 0) {
                throw new Error('Expense amount must be positive.')
            }
        },
    },
    date: {
        type: Date,
        require: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
