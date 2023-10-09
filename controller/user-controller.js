const response = require("../utils/reponse");
const user_services = require("../services/user-services");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { success_response, error_response } = response;
const {
  create_new_user,
  find_user_by_email,
  find_user_by_id,
  edit_user,
  check_user_access,
} = user_services;

exports.register = async (req, res) => {
  try {
    const new_user = await create_new_user(req.body);
    const token = new_user.getSignedToken();
    const refresh_token = new_user.refreshToken();

    const response = { token, user: new_user };
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, //httpOnly: true: This flag indicates that the cookie can only be accessed by the server and not by JavaScript running in the browser. This is a security measure to protect the token from being accessed by malicious scripts.
      // sameSite: "None", // This setting allows the cookie to be sent with cross-origin requests
      // secure: false,
      // secure: process.env.ENV === "dev" ? false : true, // This flag ensures that the cookie is only sent over HTTPS connections, enhancing security
      maxAge: 24 * 60 * 60 * 1000, // This sets the maximum age of the cookie to 24 hours, after which it will expire
    });
    success_response(res, 201, response);
  } catch (err) {
    console.log(err);
    return error_response(res, "Internal Server Error", 500, err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await find_user_by_email(email);
    if (!user) return error_response(res, "Invalid credentials", 401);

    if (user && !user.password) {
      return error_response(res, "Invalid credentials", 401);
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      const signed_in_user = await find_user_by_id(user._id);
      const token = signed_in_user.getSignedToken();
      const refresh_token = signed_in_user.refreshToken();
      const response = { token, user: signed_in_user };
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true, //httpOnly: true: This flag indicates that the cookie can only be accessed by the server and not by JavaScript running in the browser. This is a security measure to protect the token from being accessed by malicious scripts.
        // sameSite: "None", // This setting allows the cookie to be sent with cross-origin requests
        // secure: process.env.ENV === "dev" ? false : true, // This flag ensures that the cookie is only sent over HTTPS connections, enhancing security
        maxAge: 24 * 60 * 60 * 1000, // This sets the maximum age of the cookie to 24 hours, after which it will expire
        // secure: false,
      });
      return success_response(res, 200, response);
    } else {
      return error_response(res, "Invalid credentials", 401);
    }
  } catch (err) {
    console.log(err);
    return error_response(res, "Internal Server Error", 500);
  }
};

exports.generate_new_access_token = async (req, res) => {
  try {
    const refresh_token = req.cookies?.refresh_token;
    console.log({ refresh_token });
    if (!refresh_token) {
      return error_response(res, "Invalid refresh token", 404);
    }

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) return error_response(res, "Invalid refresh token", 404);
    const user = await find_user_by_id(decoded.id);

    const token = user.getSignedToken();
    const response = {
      message: "New access token generated",
      token,
    };

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true, //httpOnly: true: This flag indicates that the cookie can only be accessed by the server and not by JavaScript running in the browser. This is a security measure to protect the token from being accessed by malicious scripts.
      // sameSite: "None", // This setting allows the cookie to be sent with cross-origin requests
      // secure: process.env.ENV === "dev" ? false : true, // This flag ensures that the cookie is only sent over HTTPS connections, enhancing security
      maxAge: 24 * 60 * 60 * 1000, // This sets the maximum age of the cookie to 24 hours, after which it will expire
      // secure: false,
    });

    return success_response(res, 200, response);
  } catch (err) {
    console.log(err);
    return error_response(res, err, 500);
  }
};

exports.update_user = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const check = await check_user_access(req.user, user_id);
    if (!check)
      return error_response(
        res,
        "Unauthorised, You cannot edit someone elses record",
        400
      );

    const update = req.body;

    const edited_user = await edit_user(user_id, update);
    return success_response(res, 200, edited_user);
  } catch (err) {
    console.log(err);
    return error_response(res, "Internal Server Error", 500);
  }
};
