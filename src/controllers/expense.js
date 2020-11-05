const { validationResult } = require('express-validator')
const Expense = require('../models/expense')
const timeFormat = require('../utils/date')

const getDailyExpense = async (req, res) => {
    const currentDate = req.query.date
    const { _id } = req.user
    const today = timeFormat()

    if (!currentDate || !_id) {
        return res.redirect('/user/login', req.flash('warning', 'Client should log in first!'))
    }

    try {
        // use lean() to get plain old JavaScript objects not mongoose document class. If we are not executing a query and sending the results without modification, we should use lean().
        const expense = await Expense.find({ owner: { _id }, date: currentDate }).lean()

        let sum

        if (expense.length === 0) {
            return res.render('index', {
                noExpense: true,
                logout: true,
                indexJS: true,
                indexCSS: true,
                currentDate,
                sum: 0,
                today,
            })
        }

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
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

const getNewExpense = (req, res) => {
    const currentDate = req.query.date
    res.render('addExpense', {
        formCSS: true,
        validationFormJS: true,
        signUpDecorationCSS: true,
        currentDate,
    })
}

const getEditExpense = async (req, res) => {
    const expenseId = req.params.expenseId
    const currentDate = req.query.date

    try {
        const expense = await Expense.findById(expenseId).lean()

        if (!expense) {
            return res.status(404).send()
        }

        res.render('addExpense', {
            formCSS: true,
            validationFormJS: true,
            signUpDecorationCSS: true,
            isEditing: true,
            expenseId,
            currentDate,
            expense,
        })
    } catch (e) {
        res.status(400).send(e)
    }
}

const postNewExpense = async (req, res) => {
    const expense = new Expense({ ...req.body, owner: req.user._id })
    const { name, amount, date, category, description } = req.body
    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.status(400).render('addExpense', {
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
        res.status(400).send(e)
        return res.redirect(`/expense?date=${date}`)
    }
}

const patchExpense = async (req, res) => {
    const expenseId = req.params.expenseId
    // const currentDate = req.query.date
    const updates = Object.keys(req.body)
    const allowedUpdates = ['__method', 'name', 'amount', 'date', 'category', 'description']
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
