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
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // (next on password validation) Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
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
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
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
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")//this is where the management view will be populated if the password match
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email, //if the passwords do not match the login page will be displayed again with the email already filled in
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
accountCon.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  req.flash("notice", "You're logged in") // Optional: Set flash message here
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: req.flash("notice"), // Shows flash message if present
  });
};



module.exports = accountCon;

/* after this you build the login view which is what will display when the user clicks on the my account link */
