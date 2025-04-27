const Product = require("../Models/ProductModel");
const upload = require("../config/upload");
const path = require('path');

//Product Insert
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stockQuantity } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Store the relative path for the database
        const imageUrl = path.join('uploads', path.basename(req.file.path));

        const product = new Product({
            name,
            description,
            price,
            category,
            stockQuantity,
            imageUrl
        });

        await product.save();
        return res.status(201).json({ product });
    } catch (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ message: "Error adding product", error: err.message });
    }
};

//Get By ID
const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (err) {
        console.error("Error fetching product:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

//Update Product
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body };
        
        if (req.file) {
            // Store the relative path for the database
            updateData.imageUrl = path.join('uploads', path.basename(req.file.path));
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ message: "Error updating product", error: err.message });
    }
};

//Delete Product
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ message: "Error deleting product", error: err.message });
    }
};

// Display Product with Filters
const getAllProduct = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, isActive } = req.query;
        let filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found matching filters" });
        }

        return res.status(200).json({ products });
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

exports.addProduct = addProduct;
exports.getAllProduct = getAllProduct;
exports.getById = getById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;

