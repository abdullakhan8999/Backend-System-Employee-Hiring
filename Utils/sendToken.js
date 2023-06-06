//Create a new token and save in cookie
const sendToken = async (user, statusCode, res) => {
  try {
    //Option for cookie 24h 60min 60sec 1000milSec
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    let token = await user.getJwtToken();
    if (user.role === 'company') {
      //response
      res.status(statusCode).cookie("token", token, options).json({
        status: "success",
        token,
        companyName: user.companyName,
        description: user.description,
        location: user.location,
        email: user.email,
        role: user.role,
        jobs: user.jobs,
        jobApplications: user.jobApplications,
      });
    } else {
      await console.log(user);
      res.status(statusCode).cookie("token", token, options).json({
        status: "success",
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });

    }

  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Error in sending token" + error,
    })
  }
};

module.exports = sendToken;
