const express = require("express");
const router = express.Router();
const SupplierRegiController = require("../Controllers/SupplierRegiControllers"); 

router.get("/", SupplierRegiController.getAllSupplier);
router.post("/", SupplierRegiController.addSupplier);
router.get("/:id", SupplierRegiController.getById);
router.delete("/:id", SupplierRegiController.deleteSupplier);

module.exports = router;
