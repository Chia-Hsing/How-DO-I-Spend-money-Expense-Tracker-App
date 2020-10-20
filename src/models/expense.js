const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        trim: true,
    },
    expense: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        require: true,
    },
    category: {
        type: String,
        required: true,
    },
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
