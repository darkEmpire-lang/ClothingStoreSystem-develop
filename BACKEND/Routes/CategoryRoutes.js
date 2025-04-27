const express = require("express");
const router = express.Router();
const CategoryController = require("../Controllers/CategoryControllers");

// Add new category
router.post("/", CategoryController.addCategory);

// Get all categories
router.get("/", CategoryController.getAllCategories);

// Get category by ID
router.get("/:id", CategoryController.getCategoryById);

// Delete category by ID
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
