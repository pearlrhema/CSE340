/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/index")

const cookieParser = require("cookie-parser")

const session = require("express-session")
const pool = require('./database/')
//bring the account route into scope
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")


/* ***********************
 View Engine and Templates
 *************************/
/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser()) // for parsing cookies

/**** ensuring that local account data is available to all */
app.use((req, res, next) => {
  res.locals.accountData = req.session.account || null;
  res.locals.loggedin = req.session.loggedin || false;
  next();
});
app.use(utilities.checkJWTToken) // to checek if the token exist


/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)

// i want to set the public folder as static in order to view the checker image
app.use(express.static('public'));

//account Route
/* this will direct every request that starts with account to the account route   */
app.use("/account", accountRoute)
/*when that is done go over to the accountController.js */


// Index routes
// app.get("/", function (req, res) {
//   res.render("index", {title: "Home"})
// })
app.get("/", utilities.handleErrors(baseController.buildHome))

// app.get("/godwin", function (req, res) {
//   req.flash("notice", "This is a flash message from /godwin.");
//   res.redirect("/");
// }) //this code will redirect the user to the home page after the flash message is displayed but it will not be displayed on the home page.


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
