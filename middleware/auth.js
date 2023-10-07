const jwt = require("jsonwebtoken");
const response = require("../utils/reponse");
const user_services = require("../services/user-services");

const { error_response } = response;
const { find_user_by_id } = user_services;

exports.protectAPI = async (req, res, next) => {
  let token;

  console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    if (!token)
      return next(
        error_response(res, "Not Authorized to access this route", 401)
      );

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await find_user_by_id(decoded.id);
      if (!user) return next(error_response(res, "No user found", 404));
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return next(error_response(res, "Not authorised", 401, error));
    }
  } else {
    return next(error_response(res, "Not authorised", 401));
  }
};
