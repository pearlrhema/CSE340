const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")


const invCont = {}

/*******************************************************
 * Building inventory by classification view
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */

/** *****************************************************/
// *  Build Inventory by Classification View
// * **************************************************** */
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

// //* ***************************
// // *  Build Edit Inventory View
// // * ************************** */
// invCont.buildEditInventory = async function (req, res) {
//   const inv_id = parseInt(req.params.invId)
//   const data = await invModel.getInventoryById(inv_id)
//   const classificationSelect = await utilities.buildClassificationList(data[0].classification_id)
//   let nav = await utilities.getNav()
//   res.render("inventory/edit-inventory", {
//     title: "Edit Vehicle",
//     nav,
//     classificationSelect,
//     data: data[0],
//     errors: null,
//     message: req.flash("message")
//   })
// }

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const classification_id = parseInt(req.params.classification_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
      errors: null,
      message: req.flash("message")
    })
}
//when the values are brought in from the database to populate the form fields, as well as when we detect errors, we will use local params to do so. This is why each of the individual values are declared in this controller function as part of the render data object

//* ***************************
// *  Edit Inventory Item
// * ************************** */
invCont.editInventory = async function (req, res) {
  const {
    inv_id,
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
  const classificationSelect = await utilities.buildClassificationList(classification_id);

  // Validate form data first
  if (!errors.isEmpty()) {
    return res.render("inventory/edit-inventory", {
      title: "Edit Vehicle",
      nav,
      classificationSelect,
      errors: errors.array(),
      message: null
    });
  }

  try {
    // Convert string values to integers where necessary.
    const invIdNum = parseInt(inv_id); 
    const classificationIdNum = parseInt(classification_id);

    // Call editInventory with values in the correct order.
    const editResult = await invModel.editInventory(
      invIdNum,               // 1. Vehicle ID
      classificationIdNum,    // 2. classification_id
      inv_make,               // 3. Make
      inv_model,              // 4. Model
      inv_year,               // 5. Year
      inv_description,        // 6. Description
      inv_image,              // 7. Image
      inv_thumbnail,          // 8. Thumbnail
      inv_price,              // 9. Price
      inv_miles,              // 10. Miles
      inv_color               // 11. Color
    );

    if (editResult) {
      req.flash("notice", `Successfully modified ${inv_make} ${inv_model} in inventory.`);
      return res.redirect("/inv");
    } else {
      throw new Error("Vehicle editing failed.");
    }
  } catch (error) {
    console.error("Error editing vehicle:", error);
    return res.render("inventory/edit-inventory", {
      title: "Edit Vehicle",
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
      msg: "Failed to edit vehicle. Try again." 
    });
  }
};

//* ***************************
// *  Build Delete Inventory View
// * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  const classification_id = parseInt(req.params.classification_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/delete-inventory", {
      title: "Delete " + itemName,
      nav,
      classificationSelect: classificationSelect,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
      errors: null,
      message: req.flash("message")
    })
}

//* ***************************
// *  Delete Inventory Item
// * ************************** */
invCont.deleteInventory = async function (req, res) {
  const {
    inv_id,
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
  const classificationSelect = await utilities.buildClassificationList(classification_id);

  // Validate form data first
  if (!errors.isEmpty()) {
    return res.render("inventory/edit-inventory", {
      title: "Edit Vehicle",
      nav,
      classificationSelect,
      errors: errors.array(),
      message: null
    });
  }

  try {
    // Convert string values to integers where necessary.
    const invIdNum = parseInt(inv_id); 
    const classificationIdNum = parseInt(classification_id);

    // Call editInventory with values in the correct order.
    const deleteResult = await invModel.deleteInventory(
      invIdNum,               // 1. Vehicle ID
      classificationIdNum,    // 2. classification_id
      inv_make,               // 3. Make
      inv_model,              // 4. Model
      inv_year,               // 5. Year
      inv_description,        // 6. Description
      inv_image,              // 7. Image
      inv_thumbnail,          // 8. Thumbnail
      inv_price,              // 9. Price
      inv_miles,              // 10. Miles
      inv_color               // 11. Color
    );

    if (deleteResult) {
      req.flash("notice", `Successfully deleted ${inv_make} ${inv_model} from inventory.`);
      return res.redirect("/inv");
    } else {
      throw new Error("Vehicle deleting failed.");
    }
  } catch (error) {
    console.error("Error editing vehicle:", error);
    return res.render("inventory/delete-inventory", {
      title: "Edit Vehicle",
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
      msg: "Failed to Delete vehicle. Try again." 
    });
  }
};

/* ***************************
 * Handles footer error link
 * ************************** */
invCont.throwError = async function (req, res) {
  throw new Error("I am an intentional error");
};


module.exports = invCont