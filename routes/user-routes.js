const express = require("express");

const user_controller = require("../controller/user-controller");

const users_rules = require("../rules/user-rules.js");
const body_validator = require("../utils/body_validator.js");

const router = express.Router();

const { register, login } = user_controller;

const { user_register_rules, user_login_rules } = users_rules;

router.post("/signup", register);
router.post("/login", login);

module.exports = router;