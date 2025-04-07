//Needed resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/");

router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

router.get("/register", utilities.handleErrors(accountController.buildRegister))

//adding path for the user registeration
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router;

//this is the first thing to be done after which we go the server.js to enable the route