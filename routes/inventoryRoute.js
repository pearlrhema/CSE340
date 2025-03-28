// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);

// Route to build inventory item details view
// router.get("/detail/:invId", invController.buildByInvId, utilities.handleErrors(invController.buildDetail));
// Vehicle Detail Route
// router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

module.exports = router;