const express = require("express");
const { protectAPI } = require("../middleware/auth");

const dashboard_controller = require("../controller/dashboard-controller");

const router = express.Router();

const { get_dashboard_data } = dashboard_controller;

router.get("/", protectAPI, get_dashboard_data);

module.exports = router;
