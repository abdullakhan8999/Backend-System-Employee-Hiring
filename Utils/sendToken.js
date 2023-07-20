const RESPONSES = require("../Constants/RESPONSES");

const sendToken = async (user, statusCode, res) => {
  try {
    const token = await user.getJwtToken();

    // options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    // resolve response depending on user
    let response;
    if (user.role === "company") {
      response = { ...RESPONSES.COMPANY.CREATE_SUCCESS, user, token };
    } else {
      response = { ...RESPONSES.USER.CREATE_SUCCESS, user, token };
    }
    // console.log(response);
    res.status(statusCode).cookie("token", token, options).json(response);
  } catch (error) {
    console.log("Error creating token: " + error);
    res.status(500).json(RESPONSES.ERROR);
  }
};

module.exports = sendToken;

