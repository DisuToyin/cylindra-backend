const response = require("../utils/reponse");
const user_services = require("../services/user-services");
const bcrypt = require("bcryptjs");

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
    const response = { token, user: new_user };
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
      const response = { token, user: signed_in_user };
      return success_response(res, 200, response);
    } else {
      return error_response(res, "Invalid credentials", 401);
    }
  } catch (err) {
    console.log(err);
    return error_response(res, "Internal Server Error", 500);
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
  }
};
