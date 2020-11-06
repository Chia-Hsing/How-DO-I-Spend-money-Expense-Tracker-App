const Expense = require('../models/expense')
const getChartData = require('../utils/chartData')

const getSummary = async (req, res) => {
    try {
        const month = req.query.month
        const months = await Expense.getMonths(req.user._id)
        const monthlyExpense = await Expense.find({ owner: req.user._id, month: month })
            .sort({ date: 'asc' })
            .lean()
            .exec()

        let sum = monthlyExpense
            .map(obj => {
                return obj.amount
            })
            .reduce((a, c) => {
                return a + c
            }, 0)

        const chartData = getChartData(monthlyExpense)

        return res.render('index', {
            logout: true,
            indexCSS: true,
            chartJS: true,
            chartData,
            sum,
            months,
            month,
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

module.exports = {
    getSummary,
}
