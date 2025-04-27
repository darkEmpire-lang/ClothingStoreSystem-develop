const Category = require("../Models/CategoryModle");

// Display All Categories
const getAllCategories = async (req, res, next) => {
    let categories;

    try {
        categories = await Category.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!categories || categories.length === 0) {
        return res.status(404).json({ message: "Categories not found" });
    }

    return res.status(200).json({ categories });
};

// Add New Category
const addCategory = async (req, res, next) => {
    const { name, types } = req.body;

    let category;

    try {
        category = new Category({ name, types });
        await category.save();
    } catch (err) {
        console.log(err);
    }

    if (!category) {
        return res.status(400).json({ message: "Unable to add category" });
    }

    return res.status(201).json({ category });
};

// Get Category By ID
const getCategoryById = async (req, res, next) => {
    const id = req.params.id;

    let category;

    try {
        category = await Category.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category });
};

// Delete Category
const deleteCategory = async (req, res, next) => {
    const id = req.params.id;

    let category;

    try {
        category = await Category.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }

    if (!category) {
        return res.status(404).json({ message: "Unable to delete category" });
    }

    return res.status(200).json({ category });
};

exports.getAllCategories = getAllCategories;
exports.addCategory = addCategory;
exports.getCategoryById = getCategoryById;
exports.deleteCategory = deleteCategory;
