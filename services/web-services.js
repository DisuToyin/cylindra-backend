const WebModel = require("../models/website");
const https = require("https");

const create_website = async (payload, user) => {
  let { name, link, interval } = payload;
  const web = await WebModel.create({
    name,
    link,
    user_id: user.id,
    interval,
    slack: user.slack || "",
  });

  return web;
};

const get_websites = async (user) => {
  const websites = await WebModel.findOne({ user_id: user.id });
  return websites;
};

const get_all_websites = async () => {
  const websites = await WebModel.find();
  return websites;
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
};
