const Expense = require('../models/expense')

const getSummary = async (req, res) => {
    const month = req.query.month
    const monthlyExpense = await Expense.find({ owner: req.user._id, month: month })
}

module.exports = {
    getSummary,
}
