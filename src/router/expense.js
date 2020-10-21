const express = require('express')
const Expense = require('../models/expense')
require('../db/mongoose')

const router = new express.Router()

router.post('/', async (req, res) => {
    const expense = new Expense({ ...req.body })
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
    // const match = {}
    // const sort = {}
    // if (date) {
    //     match.date = date
    // }
    // if (req.query.sortBy) {
    //     const pairs = req.query.sortBy.split(':')
    //     sort[pairs[0]] = pairs[1] === desc ? -1 : 1
    //     // sortBy:desc = sort{sortBy: 1}
    // }
})

router.patch('/expense/:id', (req, res) => {})

router.delete('/expense/:id', (req, res) => {})

module.exports = router
