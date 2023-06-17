const { validationResult } = require("express-validator");
const response = require("./reponse");
const { error_response } = response;

const body_validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error_response(res, errors.array()[0].msg, 400, errors.array());
  }
  next();
};

module.exports = body_validator;
