const utilities = require('../utilities');
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")



/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .escape()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists > 0){
            throw new Error("Email exists. Please log in or use different email")
            }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}
  
/* ******************************
 * Process Login
 * ***************************** */
validate.processLogin = () => {
    return [
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Email doesn't exist. Please register"),
      body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
            
    ]
}

/* ******************************
 * Check data and return errors or continue to Login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      // console.log(errors)
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_email,
        account_password,
      })
      return
    }
    next()
}

/*  **********************************
 *  Profile Update Data Validation Rules
 * ********************************* */
validate.updateDataRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
]}


/*  **********************************
 *  Password Update  Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  console.log('you made it to the password rules')
  return [
    // password is required and must be strong password
    body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
    ]

}

/* ******************************
 * Check updated data and return errors or continue 
 * ***************************** */
validate.checkUpdatedData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    // console.log(errors)
    let nav = await utilities.getNav()
    let firstName = req.body.account_firstname
    let lastName = req.body.account_lastname
    let email = req.body.account_email
    res.render("account/profile", {
      errors,
      title: "Profile",
      nav,
      firstName,
      lastName,
      email,
    })
    return
  }
  next()
}

/* ******************************
 * Check updated password and return errors or continue 
 * ***************************** */
validate.checkUpdatedPassword = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    // console.log(errors)
    let nav = await utilities.getNav()
    let firstName = res.locals.accountData.account_firstname
    let lastName = res.locals.accountData.account_lastname
    let email = res.locals.accountData.account_email
    let account_password = req.body.account_password
    res.render("account/profile", {
      errors,
      title: "Profile",
      nav,
      firstName,
      lastName,
      email,
      account_password
    })
    return
  }
  next()
}



module.exports = validate