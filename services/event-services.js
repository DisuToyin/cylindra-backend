const EventModel = require("../models/events");
const WebModel = require("../models/website");

const check_if_user_has_access = async (user, web_id) => {
  let access = false;

  const web = await WebModel.findOne({ _id: web_id });
  if (web.user_id == user.id) {
    access = true;
  } else access = false;

  return access;
};

const create_event = async (payload) => {
  let { web_id, event_type, response_time } = payload;
  const event = await EventModel.create({
    web_id,
    event_type,
    response_time,
  });

  return event;
};

const get_events_for_web_id = async (web_id) => {
  const events = await EventModel.find({ web_id }).populate({ path: "web_id" });

  return events;
};

const get_all_events_user_id = async (payload) => {
  return "event";
};

module.exports = {
  create_event,
  get_events_for_web_id,
  get_all_events_user_id,
  check_if_user_has_access,
};
