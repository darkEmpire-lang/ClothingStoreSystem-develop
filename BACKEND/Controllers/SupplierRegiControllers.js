const Supplier = require("../Models/SupplierRegiModle"); 

//Display All Supplier
const getAllSupplier = async (req, res, next) => {
    let suppliers; 

    try {
        suppliers = await Supplier.find(); 
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!suppliers || suppliers.length === 0) {
        return res.status(404).json({ message: "Suppliers not found" }); 
    }

    return res.status(200).json({ suppliers });
};

//Add New Supplier
const addSupplier = async (req, res, next) => {

    const {name,contactNumber,address,items} = req.body;

    let suppliers;

    try {
        suppliers = new Supplier({name,contactNumber,address,items});
        await suppliers.save();
    }catch (err) {
        console.log(err);
    }

    //data not inserted 
    if (!suppliers) {
        return res.status(404).json ({message:"unable to add supplier"});
    }
    return res.status(200).json ({suppliers})

}

//Get Supplier By ID
const getById = async (req, res, next) => {

    const id = req.params.id;

    let supplier;

    try {
        supplier  = await Supplier.findById(id);
    }catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!supplier || supplier.length === 0) {
        return res.status(404).json({ message: "Suppliers not found" }); 
    }

    return res.status(200).json({ supplier });
}

//Delete Supplier
const deleteSupplier = async (req, res, next) => {
    const id = req.params.id;

    let supplier;

    try {
        supplier = await Supplier.findOneAndDelete(id)
    } catch (err) {
        console.log(err);
    }

    if (!supplier || supplier.length === 0) {
        return res.status(404).json({ message: "Unable to Delete Supplier" }); 
    }

    return res.status(200).json({ supplier });

}


exports.getAllSupplier = getAllSupplier;
exports.addSupplier = addSupplier;
exports.getById = getById;
exports.deleteSupplier = deleteSupplier;