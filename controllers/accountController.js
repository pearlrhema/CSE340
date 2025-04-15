const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

//the password validation starts here by adding bcryptjs to the dependencies ( pnpm add bcrytjs)
const bcrypt = require("bcryptjs")

const accountCon = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCon.buildLogin = async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null /*Add the following line to the data object being sent to the view within the res.render() function.
      errors: null*/
    });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCon.buildRegister = async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null /*Add the following line to the data object being sent to the view within the res.render() function.
      errors: null*/
    })
  }
/* ****************************************
*  Process Registration
* *************************************** */
accountCon.registerAccount = async function registerAccount(req, res) {
    let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body
  
  // (next on password validation) Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash(
      "notice",
      'Sorry, there was an error processing the registration.'
    )
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        errors: null,
        account_email: account_email, // Pre-fill the email field in the login form
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        errors: null,
        nav,
      })
    }
}
  
/* ****************************************
*  Process Registration
* *************************************** */
// accountCon.loginAccount = async function loginAccount(req, res) {
//     let nav = await utilities.getNav()
//     const { account_email, account_password } = req.body
  
//     const loginResult = await accountModel.loginAccount(
//       account_email,
//       account_password
//     )
  
//     if (loginResult) {
//       req.flash("notice", `Welcome back ${account_email}`)
//       res.status(200).render("account/login", {
//         title: "Login",
//         nav,
//       })
//     } else {
//       req.flash("notice", "Sorry, the login failed.")
//       res.status(501).render("account/login", {
//         title: "Login",
//         nav,
//       })
//     }
// }


// accountCon.loginAccount = async function loginAccount(req, res) {
//   let nav = await utilities.getNav()
//   const { account_email, account_password } = req.body

//   try {
//     const accountData = await accountModel.loginAccount(account_email)

//     if (!accountData) {
//       req.flash("notice", "Email not found.")
//       return res.status(401).render("account/login", {
//         title: "Login",
//         nav,
//         errors: null,
//         account_email,
//       })
//     }

//     const match = await bcrypt.compare(account_password, accountData.account_password)

//     if (match) {
//       req.flash("notice", `Welcome back, ${accountData.account_firstname}`)
//       // You might also want to set session here later
//       return res.status(200).redirect("/") // or go to dashboard or home
//     } else {
//       req.flash("notice", "Incorrect password.")
//       return res.status(401).render("account/login", {
//         title: "Login",
//         nav,
//         errors: null,
//         account_email,
//       })
//     }
//   } catch (error) {
//     console.error("Login error:", error)
//     req.flash("notice", "An error occurred during login.")
//     res.status(500).render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//       account_email,
//     })
//   }
// }

/* ****************************************
 *  Process login request
 * ************************************ */
accountCon.accountLogin = async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      
      utilities.updateCookie(accountData, res);
     
      return res.redirect("/account/");
    } // Need to have a wrong password option
    else {
      req.flash("notice", "Please check your credentials and try again."); // Login was hanging with bad password but correct id
      res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
accountCon.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  // req.flash("notice", "You're logged in") // Optional: Set flash message here
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    // message: req.flash("notice"), // Shows flash message if present
  });
  return;
};

/* ****************************************
 *  Process logout request
 * ************************************ */
accountCon.accountLogout = async function accountLogout(req, res) {
  res.clearCookie("jwt")
  delete res.locals.accountData;
  res.locals.loggedin = 0;
  req.flash("notice", "Logout successful.")
  res.redirect("/");
  return; 

}
/* ****************************************
 *  Deliver account update view get
 * *************************************** */
accountCon.buildUpdate = async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav();

  const accountDetails = await accountModel.getAccountById(req.params.accountId);
  const {account_id, account_firstname, account_lastname, account_email} = accountDetails;
  res.render("account/update", {
    title: "Update",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  });
}

/* ****************************************
 *  Process account update post
 * *************************************** */
accountCon.updateAccount = async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    // account_password,
  } = req.body;

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated ${account_firstname}.`
    );

    //Update the cookie accountData
    // TODO: Better way to do this?

    const accountData = await accountModel.getAccountById(account_id); // Get it from db so we can remake the cookie
    delete accountData.account_password;
    res.locals.accountData.account_firstname = accountData.account_firstname; // So it displays correctly
    utilities.updateCookie(accountData, res); // Remake the cookie with new data

    res.status(201).render("account/account-management", {
      title: "Management",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      nav,
    });
  }
}

/* ****************************************
 *  Process account password update post
 * *************************************** */
accountCon.updatePassword = async function updatePassword(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body;

  // Hash the password before storing.
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    );
    res.status(500).render("account/update", {
      title: "Update",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated the password.`
    );
    res.status(201).render("account/account-management", {
      title: "Manage",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      nav,
    });
  }
}


module.exports = accountCon;

/* after this you build the login view which is what will display when the user clicks on the my account link */
