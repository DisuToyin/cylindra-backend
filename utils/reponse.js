const success_response = (res, statusCode = 200, data = {}) => {
  return res.status(statusCode).json({ success: true, data });
};

const error_response = (res, message, statusCode = 500, error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

module.exports = { success_response, error_response };
