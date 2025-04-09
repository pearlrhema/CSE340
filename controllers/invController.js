const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
// invCont.buildByClassificationId = async function (req, res, next) {
//   const classification_id = req.params.classificationId
//   const data = await invModel.getInventoryByClassificationId(classification_id)
//   const grid = await utilities.buildClassificationGrid(data)
//   let nav = await utilities.getNav()
//   // const className = data[0].classification_name
//   const className = (data !== undefined && data.length > 0) ? data[0].classification_name : "Unknown";
//   res.render("./inventory/classification", {
//     title: className + " vehicles",
//     nav,
//     grid,
//   })
// }

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    let nav = await utilities.getNav();

    if (!data) {
      return res.status(404).render("errors/error", {
        title: "Not Found",
        message: "No vehicles found for this classification.",
        nav
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });

  } catch (error) {
    next(error);
  }
};


// invCont.buildByInvId = async function (req, res, next) {
//   const inv_id = req.params.invId
//   const data = await invModel.getInventoryById(inv_id) // Fetch item details
//   const grid = await utilities.buildDetails(data)
//   let nav = await utilities.getNav()

//   if (!data) {
//     return res.status(404).render("error", { title: "Not Found", message: "Vehicle not found", nav });
//   }

//   res.render("./inventory/detail", {
//     title: data.inv_make + " " + data.inv_model,
//     nav,
//     grid,
//   });
// };

invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryById(inv_id); // Fetch item details
    let nav = await utilities.getNav();

    if (!data) {
      return res.status(404).render("errors/error", { 
        title: "Not Found", 
        message: "Vehicle not found", 
        nav 
      });
    }

    const grid = await utilities.buildDetails(data); 

    res.render("./inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      grid,
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

//(2) after building the management view in the management.ejs, we need it to be displayed by the controller so we build the management view logic here
invCont.buildManagementView = async function (req, res) {
  let nav = await utilities.getNav()
  let messages = req.flash("notice")
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    messages,
  })
}
// NEXT WE Add a route like /inv/ in the inventory routes file that renders the view via controller


/* ***************************
 * Handles footer error link
 * ************************** */
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error");
};


module.exports = invCont