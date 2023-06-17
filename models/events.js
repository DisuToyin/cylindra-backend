const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema(
  {
    web_id: {
      type: String,
      required: true,
      ref: "Website",
    },

    event_type: {
      type: String,
      required: true,
    },

    response_time: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
