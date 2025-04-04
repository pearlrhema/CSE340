//Needed resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/");

router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;

//this is the first thing to be done after which we go the server.js to enable the route