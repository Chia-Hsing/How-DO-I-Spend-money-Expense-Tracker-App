const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    expense: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
