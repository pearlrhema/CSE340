const utilities = require("../utilities/")

const accountCon = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCon.buildLogin = async function buildLogin(req, res, next) {
    try {
        let nav = await utilities.getNav();
        res.render("account/login", {
            title: "Login",
            nav,
        });
    } catch (error) {
        next(error);
    }
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCon.buildRegister = async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }



module.exports = accountCon;

/* after this you build the login view which is what will display when the user clicks on the my account link */
