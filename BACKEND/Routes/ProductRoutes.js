const express = require("express");
const router = express.Router();
const ProductController = require("../Controllers/ProductControllers");
const upload = require("../config/upload");

// Get all products with filters
router.get("/", ProductController.getAllProduct);

// Add new product with image upload
router.post("/", upload.single('image'), ProductController.addProduct);

// Get product by ID
router.get("/:id", ProductController.getById);

// Update product with optional image upload
router.put("/:id", upload.single('image'), ProductController.updateProduct);

// Delete product
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
