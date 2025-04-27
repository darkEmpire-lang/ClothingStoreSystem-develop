// Routes/FinanceRouter.jsconst express = require("express");
const express = require("express");
const router = express.Router();
const FinanceReport = require("../Models/FinanceReports"); // Import the Mongoose model
const { body, validationResult } = require("express-validator");

// Input validation rules for the finance report fields
const validateFinanceInput = [
  body("month").notEmpty().withMessage("Month is required"), // Check if 'month' is provided
  body("revenue")
    .isNumeric()
    .withMessage("Revenue must be a number")
    .isFloat({ min: 0 })
    .withMessage("Revenue must be a non-negative number"),
  body("expenses")
    .isNumeric()
    .withMessage("Expenses must be a number")
    .isFloat({ min: 0 })
    .withMessage("Expenses must be a non-negative number"),
];

// Route to add a new finance report
router.post("/add", validateFinanceInput, async (req, res) => {
  const errors = validationResult(req); // Validate input
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); // Return validation errors, if any
  }

  const { month, revenue, expenses } = req.body;
  try {
    const profitOrLoss = revenue - expenses; // Calculate profit or loss
    const newReport = new FinanceReport({ month, revenue, expenses, profitOrLoss });

    await newReport.save(); // Save to database
    res.status(201).json({ message: "Finance report added successfully!" });
  } catch (error) {
    console.error("Database error:", error); // Log for debugging
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Route to get all finance reports
router.get("/", async (req, res) => {
  try {
    const reports = await FinanceReport.find(); // Fetch all reports
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching finance reports:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Route to get a specific finance report by ID
router.get("/:id", async (req, res) => {
  try {
    const report = await FinanceReport.findById(req.params.id); // Fetch by ID
    if (!report) {
      return res.status(404).json({ message: "Finance report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching finance report by ID:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Route to update a finance report by ID
router.put("/update/:id", validateFinanceInput, async (req, res) => {
  const errors = validationResult(req); // Validate input
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { month, revenue, expenses } = req.body;
    const profitOrLoss = revenue - expenses; // Recalculate profit or loss

    const updateData = { month, revenue, expenses, profitOrLoss };
    const updatedReport = await FinanceReport.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // Return the updated report
      runValidators: true, // Validate updated data
    });

    if (!updatedReport) {
      return res.status(404).json({ message: "Finance report not found" });
    }

    res.status(200).json({ message: "Finance report updated successfully!", report: updatedReport });
  } catch (error) {
    console.error("Error updating finance report:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Route to delete a finance report by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedReport = await FinanceReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ message: "Finance report not found" });
    }
    res.status(200).json({ message: "Finance report deleted successfully!" });
  } catch (error) {
    console.error("Error deleting finance report:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router; // Export the router
