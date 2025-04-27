// Models/FinanceReport.js
const mongoose = require("mongoose"); // Import mongoose

// Define the finance report schema
const financeReportSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
    min: 0, // Ensure revenue is not negative
  },
  expenses: {
    type: Number,
    required: true,
    min: 0, // Ensure expenses are not negative
  },
  profitOrLoss: {
    type: Number,
    default: function () {
      return this.revenue - this.expenses; // Calculate if not provided
    },
    required: false, // Allow this to be optional
  },
});

// Middleware to update profitOrLoss before saving, in case revenue/expenses are modified.
financeReportSchema.pre("save", function (next) {
  if (this.isModified("revenue") || this.isModified("expenses")) {
    this.profitOrLoss = this.revenue - this.expenses; // Recalculate profit or loss on update
  }
  next();
});

// Create and export the model
const FinanceReport = mongoose.model("FinanceReport", financeReportSchema);
module.exports = FinanceReport;
