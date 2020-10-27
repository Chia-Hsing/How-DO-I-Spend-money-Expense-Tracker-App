const { validationResult } = require('express-validator')
const Expense = require('../models/expense')

const getCreateExpense = (req, res) => {
    res.render('newExpense')
}

const getDailyExpense = async (req, res) => {
    const date = req.query.date

    try {
        const expense = await Expense.find({ date: date })
        if (expense) {
            return res.render('index', { signUpDecorationCSS: true }).send(expense)
        }

        return res.send()
    } catch (e) {
        res.status(404).send(e)
    }
}

const postCreateExpense = async (req, res) => {
    const expense = new Expense({ ...req.body, owner: req.user._id })
    const { name, amount, date, category, description } = req.body
    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.status(400).render('newExpense', {
            errors: req.flash('warning', result),
            expense: { name, amount, date, category, description },
        })
    }

    try {
        await expense.save()
        return res.status(201).redirect('/expense/homepage')
    } catch (e) {
        req.flash('refuse', 'Something went wrong, please try again later!')
        res.status(404).send(e)
        return res.redirect('/expense/homepage')
    }
}

module.exports = {
    getCreateExpense,
    postCreateExpense,
    getDailyExpense,
}
