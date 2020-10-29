const { validationResult } = require('express-validator');
const Expense = require('../models/expense');

const getDailyExpense = async (req, res) => {
  const currentDate = req.query.date;
  const { _id } = req.user;

  try {
    const expense = await Expense.find({ owner: _id, date: currentDate });
    if (expense.length === 0) {
      return res.render('index', {
        noExpense: true,
      });
    }

    return res.render('index');
  } catch (e) {
    res.status(404).send(e);
  }
};

const getNewExpense = (req, res) => {
  res.render('newExpense', {
    formCSS: true,
    validationFormJS: true,
  });
};

const postNewExpense = async (req, res) => {
  const expense = new Expense({ ...req.body, owner: req.user._id });
  const { name, amount, date, category, description } = req.body;
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).render('newExpense', {
      errors: req.flash('warning', result.array()),
      expense: { name, amount, date, category, description },
      formCSS: true,
      validationFormJS: true,
      signUpDecorationCSS: true,
    });
  }

  try {
    await expense.save();
    return res.status(201).redirect(`/expense?date=${date}`);
  } catch (e) {
    req.flash('refuse', 'Something went wrong, please try again later!');
    res.status(404).send(e);
    return res.redirect(`/expense?date=${date}`);
  }
};

module.exports = {
  getNewExpense,
  postNewExpense,
  getDailyExpense,
};
