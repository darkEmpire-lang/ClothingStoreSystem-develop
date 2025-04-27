const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: [
        "Sales",
        "Inventory",
        "Customer Support",
        "Operation Management",
      ], // Predefined department values
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Vacation", "On Leave"], // Allowed status values
      default: "Active", // Default employee status
    },
    address: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      default: 0, // Admin assigns salary, employees cannot modify it
    },
    epf: {
      type: Number,
      required: true,
      default: 0, // Automatically calculated as 8% of salary
    },
    etf: {
      type: Number,
      required: true,
      default: 0, // Automatically calculated as 3% of salary
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Middleware to automatically calculate EPF and ETF whenever salary is assigned by admin
employeeSchema.pre("save", function (next) {
  this.epf = this.salary * 0.08; // EPF as 8% of the salary
  this.etf = this.salary * 0.03; // ETF as 3% of the salary
  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
