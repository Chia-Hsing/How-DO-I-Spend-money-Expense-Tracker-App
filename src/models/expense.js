const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User',
    },
    month: { type: String },
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
