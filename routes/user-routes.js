const express = require("express");
const { protectAPI } = require("../middleware/auth");

const user_controller = require("../controller/user-controller");

const users_rules = require("../rules/user-rules.js");
const body_validator = require("../utils/body_validator.js");

const router = express.Router();

const { register, login, update_user } = user_controller;

const { user_register_rules, user_login_rules } = users_rules;

router.post("/signup", register);
router.post("/login", login);
router.put("/:user_id/edit", protectAPI, update_user);

module.exports = router;
