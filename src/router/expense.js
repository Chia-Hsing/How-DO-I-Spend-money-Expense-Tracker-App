const express = require('express')
const Expense = require('../models/expense')
require('../db/mongoose')

const router = new express.Router()

router.post('/', async (req, res) => {
    const expense = new Expense({ ...req.body, owner: req.user._id })
    try {
        await expense.save()
        res.status(201).send(expense)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.get('/:date', async (req, res) => {
    const date = req.params.date

    const expense = await Expense.find({ date: date })
    res.send(expense)
})

// router.patch('/:id', (req, res) => {})

// router.delete('/:id', (req, res) => {})

module.exports = router
