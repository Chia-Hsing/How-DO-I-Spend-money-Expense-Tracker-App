const { validationResult } = require('express-validator')
const Expense = require('../models/expense')

const getDailyExpense = async (req, res) => {
    const currentDate = req.query.date
    const { _id } = req.user

    console.log(currentDate)
    if (!currentDate || !_id) {
        return res.redirect('/user/login', req.flash('warning', 'Client should log in first!'))
    }

    try {
        // use lean() to get plain old JavaScript objects not mongoose document class. If we are not executing a query and sending the results without modification, we should use lean().
        const expense = await Expense.find({ owner: { _id }, date: currentDate }).lean()

        if (expense.length === 0) {
            return res.render('index', {
                noExpense: true,
                searchJS: true,
                currentDate,
            })
        }

        return res.render('index', {
            searchJS: true,
            expense,
            currentDate,
        })
    } catch (e) {
        res.status(404).send(e)
    }
}

const getNewExpense = (req, res) => {
    const currentDate = req.query.date
    res.render('newExpense', {
        formCSS: true,
        validationFormJS: true,
        currentDate,
    })
}

const postNewExpense = async (req, res) => {
    const expense = new Expense({ ...req.body, owner: req.user._id })
    const { name, amount, date, category, description } = req.body
    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.status(400).render('newExpense', {
            errors: result.array(),
            expense: { name, amount, date, category, description },
            formCSS: true,
            validationFormJS: true,
            signUpDecorationCSS: true,
        })
    }

    try {
        await expense.save()
        return res.status(201).redirect(`/expense?date=${date}`)
    } catch (e) {
        req.flash('refuse', 'Something went wrong, please try again later!')
        res.status(404).send(e)
        return res.redirect(`/expense?date=${date}`)
    }
}

module.exports = {
    getNewExpense,
    postNewExpense,
    getDailyExpense,
}
