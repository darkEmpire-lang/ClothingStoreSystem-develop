const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    items: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Supplier", supplierSchema);  
