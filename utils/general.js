const axios = require("axios");
async function send_slack_message(url, message) {
  try {
    const response = await axios.post(url, { text: message });
    console.log("Slack message sent successfully");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error sending Slack message:", error);
  }
}

// Pagination function
function paginate_data(page, pageSize, data) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedData = data.slice(startIndex, endIndex);

  const result = {
    page,
    pageSize,
    totalItems,
    totalPages,
    data: paginatedData,
  };

  if (page < totalPages) {
    result.next = Number(page) + 1;
  }

  if (page > 1) {
    result.previous = Number(page) - 1;
  }

  return result;
}

module.exports = { send_slack_message, paginate_data };
