const response = require("../utils/reponse");
const event_services = require("../services/event-services");
const web_services = require("../services/web-services");

const { success_response, error_response } = response;

exports.get_dashboard_data = async (req, res) => {
  try {
    let sites = await web_services.get_websites(req.user);
    let down_count = 0;
    let up_count = 0;
    if (sites?.length > 0) {
      for (let site of sites) {
        let id = site.id;
        console.log({ id });
        let site_status = await web_services.check_site_status(site?.link);
        site_status === "up" ? up_count++ : down_count++;
      }
    }

    const events_timeline = await event_services.get_all_events_user_id(
      req.user.id
    );
    console.log(req.user.id);
    let response = {
      sites_total: sites?.length || 0,
      sites_up: up_count,
      sites_down: down_count,
      sites_paused: 0,
      events_timeline,
      sites_graph: [],
    };
    success_response(res, 201, response);
  } catch (err) {
    console.error(err);
  }
};
