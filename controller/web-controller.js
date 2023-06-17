const response = require("../utils/reponse");
const web_services = require("../services/web-services");
const event_services = require("../services/event-services");
const general = require("../utils/general");

const { create_website, get_websites, get_all_websites } = web_services;
const { get_events_for_web_id, check_if_user_has_access } = event_services;

const { error_response, success_response } = response;

exports.create_website = async (req, res) => {
  try {
    const web = await create_website(req.body, req.user);
    success_response(res, 201, web);
  } catch (err) {
    error_response(res, "Internal Server Error", 500, err);
  }
};

exports.get_websites = async (req, res) => {
  try {
    const websites = await get_all_websites();
    success_response(res, 201, websites);
  } catch (err) {
    error_response(res, "Internal Server Error", 500, err);
  }
};

exports.get_website_events = async (req, res) => {
  try {
    const webid = req.params.web_id;
    const access = await check_if_user_has_access(req.user, webid);

    if (!access) {
      return error_response(
        res,
        "Unauthorised to fetch events for this website",
        401
      );
    }

    const page = req.query.page;
    const page_size = req.query.pagesize;

    const events = await get_events_for_web_id(webid);
    const pagnated = general.paginate_data(page, page_size, events);
    success_response(res, 200, pagnated);
  } catch (err) {
    console.log(err);
    error_response(res, "Internal Server Error", 500, err);
  }
};
