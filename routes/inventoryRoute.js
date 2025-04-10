// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

const { invRules, checkInvData } = require("../utilities/inventory-validation")

//we do the checking for the classification name here
const { check } = require("express-validator")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);
// Broken route
router.get("/broken", utilities.handleErrors(invController.throwError));

//route to build management view (task one ends here)
router.get("/", utilities.handleErrors(invController.buildManagementView));

//route to build add-classification view and post the new inventory classification
router.get("/add-classification", utilities.handleErrors(invController.showAddClassificationForm));
  
router.post("/add-classification",
    [
        check("classification_name")
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("Classification name must not contain spaces or special characters.")
    ],
    utilities.handleErrors(invController.addClassification));
// NEXT WE QUERY THE DB FOR THE CLASSIFICATION NAME AND POST IT TO THE DB THROUGH THE MODEL. go to invModel.js


// Route to build add-vehicle view and post the new inventory item
// Show the Add Inventory form
// router.get("/add-inventory", invController.buildAddInventory)
router.get("/add-inventory", utilities.handleErrors( invController.buildAddInventory));


// Handle the form submission
// router.post("/add-inventory", invController.addInventory)

// Show the form
// router.get("/add-inventory", invController.buildAddInventory)

// Handle form post with validation
router.post(
  "/add-inventory",
  invRules(),
  checkInvData,
  invController.addInventory
)


// Route to build inventory item details view
// router.get("/detail/:invId", invController.buildByInvId, utilities.handleErrors(invController.buildDetail));
// Vehicle Detail Route
// router.get("/detail/:id", utilities.handleErrors(invController.buildDetail));

module.exports = router;