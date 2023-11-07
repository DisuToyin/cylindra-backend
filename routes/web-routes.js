const express = require("express");
const { protectAPI } = require("../middleware/auth");

const web_controller = require("../controller/web-controller.js");

// const users_rules = require("../rules/user-rules.js");
// const body_validator = require("../utils/body_validator.js");

const router = express.Router();

const {
  create_website,
  get_websites,
  get_website_events,
  update_website,
  delete_website,
} = web_controller;

// const { user_register_rules, user_login_rules } = users_rules;

router.post("/create", protectAPI, create_website);
router.get("/", protectAPI, get_websites);
router.get("/:web_id/events", protectAPI, get_website_events);

router.put("/edit", protectAPI, update_website);
router.delete("/delete/:web_id", protectAPI, delete_website);

module.exports = router;
