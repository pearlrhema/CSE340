const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")


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
  const classificationSelect = await utilities.buildClassificationList()
  let messages = req.flash("notice")
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    messages,
  })
}
// NEXT WE Add a route like /inv/ in the inventory routes file that renders the view via controller

// after building the add-classification view in the add-classificatio.ejs, we need it to be displayed by the controller so we build the management view logic here

// Renders the empty form
invCont.showAddClassificationForm = async (req, res) => {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("message")
  })
}

// Handles the form submission
invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  let nav = await utilities.getNav()

  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      message: null
    })
  }

  try {
    const result = await invModel.insertClassification(classification_name)
    if (result) {
      req.flash("notice", ` ${classification_name} class has been successfully added.`)
      return res.redirect("/inv")
    } else {
      throw new Error("Insert failed.")
    }
  } catch (error) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [],
      message: "Failed to add classification."
    })
  }
}

// NEXT WE Add a route like /add-classification in the inventory routes file that renders the view via controller

// Render the Add Inventory form
// controllers/invController.js
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();

    res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
      errors: null,
    message: req.flash("message")
  });
};


// Handle the form submission
// controllers/invController.js
invCont.addInventory = async function (req, res) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);

  // Handle validation errors before inserting
  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: errors.array(),
      message: null
    });
  }

  try {
    const addResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    );

    if (addResult) {
      req.flash("notice", `Successfully added ${inv_make} ${inv_model} to inventory.`);
      return res.redirect("/inv");
    } else {
      throw new Error("Vehicle insert failed.");
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: errors.array(),
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      msg: "Failed to add vehicle. Try again." 
    });
    
    //   errors: [{ msg: "Failed to add vehicle. Try again." }],
    // });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 * Handles footer error link
 * ************************** */
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error");
};


module.exports = invCont