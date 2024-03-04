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


/* ***************************
* Build details view
* ***************************/

invCont.buildDetails = async function (req, res, next) {
  const car_id = req.params.car_id
  const data = await invModel.getDetails(car_id)
  let nav = await utilities.getNav()
  let details = await utilities.buildDetails(data)
  res.render("./inventory/details", {
    title: data.inv_make + " " + data.inv_model,
    nav,
    details,
  })
}

/* ***************************
* Build Management view
* ***************************/
invCont.buildManagement = async function (reg, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Management", 
    nav,
  })
}


/* ***************************
* Build Add Classification view
* ***************************/
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
  })
}

/* ***************************
 * Build details view
 * ***************************/

invCont.addClassification = async function (req, res, next) {
  try{
    const classification_name = req.body.classification_name
    await invModel.addClassification(classification_name)
    req.flash("message", 'Classification created successfully.')
    res.status(200).render("/inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error adding the classification.')
    res.status(501).render("/inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}
module.exports = invCont