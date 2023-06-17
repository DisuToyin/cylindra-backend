const { body, query, param } = require("express-validator");

const user_register_rules = () => [
  body("email").isEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("password must be longer than 8 characters"),
  body("name").isLength({ min: 5 }).isString(),
];

const user_login_rules = () => [
  body("email").isEmail().exists(),
  body("password").exists(),
];

// const get_user_by_id_rules = () => [
//   param("user_id").isMongoId().withMessage("invalid User_ID provided"),
// ];

// const update_user_rules = () => [
//   param("user_id").isMongoId(),
//   body("email").isEmail().optional(),
//   body("first_name").isString().optional(),
//   body("last_name").isString().optional(),
//   body("country").isString().optional(),
//   body("state").isString().optional(),
//   body("address").isString().optional(),
//   body("business_name").isString().optional(),
//   body("industry").isString().optional(),
//   body("int_code").if(body("phone_number").exists()),
//   body("phone_number").isMobilePhone().optional(),
// ];

// const send_verify_email_rules = () => [
//   body("email").isEmail().withMessage("enter your register email address"),
// ];

// const verify_email_rules = () => [
//   body("email").isEmail().withMessage("enter your register email address"),
//   body("verification_code")
//     .isLength(6)
//     .withMessage("invalid verification code"),
// ];

// const get_users_rules = () => [
//   query("first_name").isString().withMessage("Only letters").optional(),
//   query("last_name").isString().withMessage("Only letters").optional(),
//   query("industry").isString().withMessage("Only letters").optional(),
//   query("business_name").isString().withMessage("Only letters").optional(),
//   query("country").isString().withMessage("Only letters").optional(),
//   // query("email_verified").isString().withMessage("Only letters").optional(),
//   // query("phone_verified").isString().withMessage("Only letters").optional(),
//   // query("user_type").isString().withMessage("Only letters").optional(),
// ];

// const get_verified_users_rules = () => [
//   query("email_verified").isBoolean().optional(),
//   query("phone_verified").isBoolean().optional(),
// ];

module.exports = {
  user_register_rules,
  user_login_rules,
  //   get_users_rules,
  //   get_user_by_id_rules,
  //   update_user_rules,
  //   send_verify_email_rules,
  //   verify_email_rules,
  //   get_verified_users_rules,
};
