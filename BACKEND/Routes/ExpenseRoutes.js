const express = require("express");
const Expense = require("../Models/Expense");

const router = express.Router();

// Add expense
router.post("/add", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json({ message: "Expense added!", newExpense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get monthly total
router.get("/monthly-total/:month", async (req, res) => {
  try {
    const month = parseInt(req.params.month); // 0 = Jan
    const year = new Date().getFullYear();

    const total = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(year, month, 1),
            $lt: new Date(year, month + 1, 1),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ total: total[0]?.totalAmount || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
