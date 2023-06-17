const UserModel = require("../models/user");

const create_new_user = async (payload) => {
  let { password, name, email, slack } = payload;
  // const salt = bcrypt.genSaltSync(10);
  // password = bcrypt.hashSync(payload.password, salt);
  const user = await UserModel.create({
    password,
    email,
    name,
    slack: slack || null,
  });

  return user;
};

const find_user_by_email = async (email) => {
  const user = await UserModel.findOne({ email });
  return user ? user : null;
};

const get_users = async () => {
  const users = await UserModel.find().populate({
    path: "user_id",
    select: "-password -createdAt -updatedAt",
  });
  return users;
};

const find_user_by_id = async (user_id) => {
  const user = await UserModel.findOne({ _id: user_id }).select("-password");
  return user;
};

const edit_user = async (user_id, update) => {
  const update_obj = Object.keys(update).reduce((acc, key) => {
    const _acc = acc;
    if (update[key] !== undefined) {
      _acc[key] = update[key];
    }
    return _acc;
  }, {});

  await UserModel.findOneAndUpdate({ _id: user_id }, update_obj, {
    runValidators: true,
    context: "query",
    new: true,
  });

  const updated_user = await find_user_by_id(user_id);

  return updated_user;
};

const check_user_access = async (user, user_id) => {
  if (user.id !== user_id) return false;
  else return true;
};

module.exports = {
  create_new_user,
  get_users,
  edit_user,
  find_user_by_email,
  find_user_by_id,
  check_user_access,
};
