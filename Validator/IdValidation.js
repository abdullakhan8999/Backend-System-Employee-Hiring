module.exports = (res) => {
   return res.status(400).json({
      status: "failed",
      message: "Invalid Job ID. Please try again",
   });
}