const { validationResult } = require('express-validator')
const Expense = require('../models/expense')
const User = require('../models/user')
const timeFormat = require('../utils/date')

// get daily expense page
const getDailyExpense = async (req, res) => {
    const currentDate = req.query.date
    const today = timeFormat()
    const { _id } = req.user

    // if there is no date search query or user id
    if (!currentDate || !_id) {
        return res.redirect('/user/login', req.flash('warning', 'Client should log in first!'))
    }

    try {
        // use the Schema.statics to set up the method for Expense model
        const months = await Expense.getMonths(_id)
        // use lean() to get plain old JavaScript objects not mongoose document class. If we are not executing a query and sending the results without modification, we should use lean().
        const expense = await Expense.find({ owner: { _id }, date: currentDate }).lean()

        let sum

        // if there is no expense at that day
        if (expense.length === 0) {
            return res.render('index', {
                noExpense: true,
                logout: true,
                indexJS: true,
                indexCSS: true,
                currentDate,
                sum: 0,
                today,
                months,
            })
        }

        // calculate the sum of the daily expense
        sum = expense
            .map(obj => {
                return obj.amount
            })
            .reduce((a, c) => {
                return a + c
            }, 0)

        return res.render('index', {
            logout: true,
            indexJS: true,
            indexCSS: true,
            expense,
            currentDate,
            sum,
            today,
            months,
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

// get adding new expense page
const getNewExpense = (req, res) => {
    // for daily expense adding request
    const currentDate = req.query.date

    res.render('addExpense', {
        formCSS: true,
        validationFormJS: true,
        decorationOneCSS: true,
        currentDate,
    })
}

// get editing expense page
const getEditExpense = async (req, res) => {
    // get the expense specific id
    const expenseId = req.params.expenseId
    // for the specific date
    const currentDate = req.query.date

    try {
        // get that expense form database
        const expense = await Expense.findById(expenseId).lean()

        // if the expense does not exist
        if (!expense) {
            return res.status(404).send()
        }

        // if it does exist
        res.render('addExpense', {
            formCSS: true,
            validationFormJS: true,
            decorationTwoCSS: true,
            isEditing: true,
            expenseId,
            currentDate,
            expense,
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

// post new expense handler
const postNewExpense = async (req, res) => {
    // req.body destructuring
    const { name, amount, date, category } = req.body
    // get month
    const month = date.split('-').slice(0, 2).join('-')
    const expense = new Expense({ ...req.body, owner: req.user._id, month })
    const result = validationResult(req)
    const currentDate = date

    if (!result.isEmpty()) {
        return res.status(400).render('addExpense', {
            errors: result.array(),
            expense: { name, amount, date, category },
            formCSS: true,
            validationFormJS: true,
            decorationOneCSS: true,
            currentDate,
        })
    }

    try {
        await expense.save()
        return res.status(201).redirect(`/expense?date=${date}`)
    } catch (e) {
        req.flash('refuse', 'Something went wrong, please try again later!')
        res.status(400).send(e)
        return res.redirect(`/expense?date=${date}`)
    }
}

// edit existing expense handler
const patchExpense = async (req, res) => {
    // get specific expense id
    const expenseId = req.params.expenseId
    // get the expense object keys
    const updates = Object.keys(req.body)
    const allowedUpdates = ['__method', '_csrf', 'name', 'amount', 'date', 'category']
    const isValidOperation = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid updates!' })
    }

    try {
        const expense = await Expense.findOne({ _id: expenseId, owner: req.user._id })

        if (!expense) {
            return res.status(404).send()
        }

        updates.forEach(update => (expense[update] = req.body[update]))
        expense.save()
        const currentDate = expense.date
        return res.status(201).redirect(`/expense?date=${currentDate}`)
    } catch (e) {
        res.status(400).send(e)
    }
}

// delete existing expense handler
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.expenseId, owner: req.user._id })

        if (!expense) {
            return res.status(404).send()
        }

        await expense.remove()
        res.send()
    } catch (e) {
        return res.status(400).send(e)
    }
}

module.exports = {
    getNewExpense,
    getDailyExpense,
    getEditExpense,
    postNewExpense,
    patchExpense,
    deleteExpense,
}
