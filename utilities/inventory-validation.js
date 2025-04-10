const { body, validationResult } = require("express-validator")

const inventoryRules = () => {
  return [
    body("make").trim().isLength({ min: 1 }).withMessage("Make is required."),
    body("model").trim().isLength({ min: 1 }).withMessage("Model is required."),
    body("year").isInt({ min: 1886 }).withMessage("Valid year is required."),
    body("color").trim().isLength({ min: 1 }).withMessage("Color is required."),
    body("mileage").isInt({ min: 0 }).withMessage("Mileage must be a positive number."),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("description").trim().isLength({ min: 1 }).withMessage("Description is required."),
    body("image_url").isURL().withMessage("Valid image URL is required."),
  ]
}

const checkInventoryData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = req.app.locals.nav || "" // fallback if nav isn't passed
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      errors: errors.array(),
      ...req.body, // make form sticky
    })
  }
  next()
}

module.exports = { inventoryRules, checkInventoryData }
