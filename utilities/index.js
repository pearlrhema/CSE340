const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetails = async function(vehicle){
  let grid = ""; // Initialize grid variable

  if(vehicle){
    grid = '<div id="inv-detail">'
    grid += '<img src="' + vehicle.inv_image 
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' on CSE Motors">'
    grid += '<div class="vehicle-details">'
    grid += '<h1>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'
    grid += '<div class="namePrice">'
    grid += '<span>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
    grid += '<div class="mileage">Mileage: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</div>'
    grid += '</div>'
    grid += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
    grid += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
    grid += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    grid += '</div>'
    grid += '</div>'
  }
  else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
 
  return grid;
}
//try and use this method to get the page
// Util.buildLogin = async function () {
//   let grid = ""; // Initialize grid variable

//   if(vehicle){
//     grid = '<div id="inv-detail">'
//     grid += '<img src="' + vehicle.inv_image
//     +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
//       + ' on CSE Motors">'
//     grid += '<div class="vehicle-details">'
//     grid += '<h1>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'
//     grid += '<div class="namePrice">'
//     grid += '<span>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
//     grid += '<div class="mileage">Mileage: ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</div>'
//     grid += '</div>'
//     grid += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
//     grid += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
//     grid += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
//     grid += '</div>'
//     grid += '</div>'
//   }
//   else {
//     grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
//   }

//   return grid;
// }

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}
 
Util.updateCookie = (accountData, res) => {
  const accessToken = jwt.sign(
    accountData,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: 3600 }
  );
  if (process.env.NODE_ENV === "development") {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
  } else {
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    });
  }
}


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }  //How is this different from the one in the account-validation.js file?

/* ****************************************
 *  Check authorization
 * ************************************ */
Util.checkAuthorizationManager = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        if(accountData.account_type == "Employee" || accountData.account_type == "Admin") {
          next();
        }
        else {
          req.flash("notice", "You are not authorized to modify inventory.");
          return res.redirect("/account/login");
        }
      }
    );
  } else {

    req.flash("notice", "You are not authorized to modify inventory.");
    return res.redirect("/account/login");
  }
}

module.exports = Util
