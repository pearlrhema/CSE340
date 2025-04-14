// utilities/inventory-validation.js
const { body, validationResult } = require("express-validator");
const utilities = require(".");
const invModel = require("../models/inventory-model");

const invRules = () => {
  return [
    body("classification_id").isInt().withMessage("Please select a valid classification."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1886 }).withMessage("Enter a valid year. not less than 1886."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Enter a valid price."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a non-negative number."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
};

// const checkInvData = async (req, res, next) => {
//   const errors = validationResult(req);
//   const nav = await utilities.getNav();
//   const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);

//   if (!errors.isEmpty()) {
//     res.render("./inventory/add-inventory", {
//       title: "Add New Vehicle",
//       nav,
//       classificationSelect,
//       errors: errors.array(),
//     });
//     return;
//   }
//   next();
// };

//use this function for stickiness purpose
const checkInvData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
   const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    res.render("./inventory/add-inventory", {
      errors: errors.array(),
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    });
    return;
  }
  next();
};

const updateRules = () => {
  return [
    body("classification_id").isInt().withMessage("Please select a valid classification."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1886 }).withMessage("Enter a valid year. not less than 1886."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Enter a valid price."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a non-negative number."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
}

const checkUpdateData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    });
    return;
  }
  next();
};

const DeleteRules = () => {
  return [
    body("classification_id").isInt().withMessage("Please select a valid classification."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1886 }).withMessage("Enter a valid year. not less than 1886."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Enter a valid price."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a non-negative number."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
}

const checkDeleteData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    res.render("inventory/delete-inventory", {
      errors,
      title: `delete ${inv_make} ${inv_model}`,
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = { invRules, checkInvData, checkUpdateData, updateRules, DeleteRules, checkDeleteData };
