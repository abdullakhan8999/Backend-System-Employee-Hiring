module.exports = (res) => {
   return res.status(400).json({
      status: "failed",
      message: "Invalid ID. Please try again",
   });
}