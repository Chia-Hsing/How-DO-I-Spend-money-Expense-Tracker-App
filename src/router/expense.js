const express = require('express')
const Expense = require('../models/expense')
require('../db/mongoose')

const router = new express.Router()

router.post('/expense', async (req, res) => {
    const expense = new Expense(req.body)
    try {
        await expense.save()
        res.status(201).send(expense)
    } catch (e) {
        res.status(404).send(e)
    }

    res.send(req.body)
})

router.get('/expense/:date', (req, res) => {})

router.patch('/expense/:id', (req, res) => {})

router.delete('/expense/:id', (req, res) => {})

module.exports = router
