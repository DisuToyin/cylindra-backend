const WebModel = require("../models/website");
const https = require("https");

const create_website = async (payload, user) => {
  let { name, link, interval } = payload;
  const web = await WebModel.create({
    name,
    link,
    user_id: user.id,
    interval,
    slack: "",
  });

  return web;
};

const get_websites = async (user) => {
  const websites = await WebModel.find({ user_id: user.id });
  return websites;
};

const get_all_websites = async () => {
  const websites = await WebModel.find();
  return websites;
};

const update_website = async (payload) => {
  const update_obj = Object.keys(payload).reduce((acc, key) => {
    const _acc = acc;
    if (
      payload[key] !== undefined &&
      payload[key] !== null &&
      payload[key] !== ""
    ) {
      _acc[key] = payload[key];
    }
    return _acc;
  }, {});

  const update = await WebModel.findOneAndUpdate(
    { _id: payload?.web_id },
    update_obj,
    {
      runValidators: true,
      context: "query",
      new: true,
    }
  );
  return update;
};

const delete_website = async (web_id) => {
  const deleted_web = await WebModel.deleteOne({ _id: web_id });
  return deleted_web;
};

async function check_site_status(link) {
  let site_status = "up";

  return new Promise((resolve, reject) => {
    const req = https.request(link, (res) => {
      // Check if the response status code indicates success
      if (res.statusCode >= 200 && res.statusCode < 400) {
        site_status = "up";
      } else if (res.statusCode >= 400 && res.statusCode < 500) {
        site_status = "unreachable";
      } else {
        site_status = "down";
      }
      resolve(site_status);
    });

    req.on("error", (error) => {
      reject(`Error occurred while checking link: ${error.message}`);
    });

    req.end();
  });
}

module.exports = {
  create_website,
  get_websites,
  check_site_status,
  get_all_websites,
  update_website,
  delete_website,
};
