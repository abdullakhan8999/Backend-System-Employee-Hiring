const RESPONSES = require("../Constants/RESPONSES");

const sendToken = async (user, statusCode = 200, res) => {
  const token = await user.getJwtToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("token", token, options).status(statusCode).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;

