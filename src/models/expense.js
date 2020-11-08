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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User',
    },
    month: { type: String },
})

expenseSchema.statics.getMonths = async owner => {
    const months = []

    const expensesDate = await Expense.find({ owner }, 'date').sort({ date: 'asc' }).exec()

    expensesDate.forEach(expenseDate => {
        const month = expenseDate.date.split('-').slice(0, 2).join('-')
        if (months.includes(month)) {
            return
        }

        months.push(month)
    })
    return months
}

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense
