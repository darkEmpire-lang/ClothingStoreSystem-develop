const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    types: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // Optional: adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("Category", categorySchema);
