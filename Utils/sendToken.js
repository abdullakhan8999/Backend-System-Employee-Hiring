const sendToken = async (user, statusCode, res) => {
  try {
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    const token = await user.getJwtToken();
    const cookieName = user.role;

    if (user.role === 'company') {
      res.status(statusCode).cookie(cookieName, token, options).json({
        status: "success",
        token,
        _id: user._id,
        companyName: user.companyName,
        description: user.description,
        location: user.location,
        email: user.email,
        role: user.role,
        jobs: user.jobs,
        jobApplications: user.jobApplications,
      });
    } else if (user.role === 'engineer') {
      res.status(statusCode).cookie(cookieName, token, options).json({
        status: "success",
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        engineerStatus: user.engineerStatus
      });
    } else {
      res.status(statusCode).cookie(cookieName, token, options).json({
        status: "success",
        token,
        _id: user._id,
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
    });
  }
};

module.exports = sendToken;
