const dotenv = require("dotenv");
const express = require("express");
const app = express();
const morgan = require("morgan");
const https = require("https");
const connectDB = require("./db/db");
const amqp = require("amqplib");

const general = require("./utils/general");

dotenv.config();
connectDB();

const user_route = require("./routes/user-routes");
const web_route = require("./routes/web-routes");

// const errorHandler = require("./middleware/error");

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/user", user_route);
app.use("/api/web", web_route);

const user_services = require("./services/user-services");
const web_services = require("./services/web-services");
const event_services = require("./services/event-services");

// app.use(errorHandler);
// publisher

async function publishToQueue(queueName, message) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });

  await channel.close();
  await connection.close();
}

//consumer
async function consumeFromQueue(queueName, onMessage) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, (message) => {
    if (message !== null) {
      onMessage(message.content.toString());
      channel.ack(message);
    }
  });

  process.on("SIGINT", () => {
    channel.close();
    connection.close();
  });
}

const periodic_check = async () => {
  console.log(
    "***********************I've started************************************"
  );
  let sites = await web_services.get_all_websites();
  publishToQueue("website-checks", JSON.stringify(sites))
    .then(() => {
      console.log("Message published to RabbitMQ");
    })
    .catch((error) => {
      console.error("Error publishing message:", error);
    });
};

consumeFromQueue("website-checks", async (message) => {
  try {
    let sites = JSON.parse(message);
    for (site of sites) {
      const site_stat = await web_services.check_site_status(site.link);
      //record this in the db

      const payload = {
        web_id: site._id,
        event_type: site_stat,
        response_time: 0,
      };

      const event_created = await event_services.create_event(payload);
      console.log("***************");
      console.log(event_created);
      console.log("***************");

      //send slack notification if site is down
      const webhook =
        site.slack ||
        "https://hooks.slack.com/services/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";
      const message = `${site.name}(${site.link}) is ${site_stat}`;

      console.log(message);

      await general.send_slack_message(webhook, message);

      //send email if site is down

      console.log(site.link);
    }
  } catch (error) {
    console.error(`Error:`, error);
  }
});

const startPeriodicCheck = () => {
  // periodic_check(); // Run the initial check immediately

  setInterval(() => {
    periodic_check(); // Run the check every 10 minutes
  }, 10 * 60 * 1000);
};

startPeriodicCheck();

app.listen(5000, () => console.log(`Server is running on 5000`));
