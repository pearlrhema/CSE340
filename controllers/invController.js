const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id) // Fetch item details
  const grid = await utilities.buildDetails(data) 
  let nav = await utilities.getNav()

  if (!data) {
    return res.status(404).render("error", { title: "Not Found", message: "Vehicle not found", nav });
  }

  res.render("./inventory/detail", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    grid,
  });
};


module.exports = invCont