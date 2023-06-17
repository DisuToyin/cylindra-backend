const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const webSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    user_id: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
    },

    web_status: {
      type: String,
      required: false,
    },

    interval: {
      type: Number,
      required: true,
      default: 5,
    },

    slack: {
      type: String,
      required: false,
    },

    // eventually add sites that require password and custom headers to access
  },
  { timestamps: true }
);

const Web = mongoose.model("Website", webSchema);

module.exports = Web;
