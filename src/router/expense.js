const express = require('express')
const Expense = require('../models/expense')
const expenseController = require('../controllers/expense')
const { body } = require('express-validator')
const isAuthenticated = require('../../public/js/auth')
require('../db/mongoose')

const router = new express.Router()

router.get('/', isAuthenticated, expenseController.getDailyExpense)

router.get('/newExpense', expenseController.getCreateExpense)

router.post(
    '/newExpense',
    [
        body('name').trim().isLength({ min: 1 }).withMessage('Expense field is required!'),
        body('amount').trim().isInt({ min: 1 }).withMessage('Amount field must be a positive integer!'),
        body('date').isISO8601().withMessage('Invalid date value!'),
        body('category')
            .not()
            .isIn([
                'food',
                'entertaining',
                'clothes',
                'knowledge',
                'transportation',
                'home supplies',
                'healthcare',
                'housing',
            ])
            .withMessage('Please provide a valid category!'),
    ],
    expenseController.postCreateExpense
)

// router.get('/:date', expenseController.getDailyExpense)

// router.patch('/:id', (req, res) => {})

// router.delete('/:id', (req, res) => {})

module.exports = router
