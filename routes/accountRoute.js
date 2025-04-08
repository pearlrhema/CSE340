//Needed resources
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/");

// (validation continues) add a require statement to bring the account-validation page, from the utilities folder into the routes scope
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

router.get("/register", utilities.handleErrors(accountController.buildRegister))

//adding path for the user registeration
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;

//this is the first thing to be done after which we go the server.js to enable the route

/*(validation) the registration view could be passed an array of errors (up to four total). Currently, the view is not equipped to display more than one. We need to alter to code so that all errors could be displayed.
Find and open the registration view in the views > account folder.*/