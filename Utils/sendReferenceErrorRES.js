const sendReferenceError = async (statusCode, res, message = "Invalid reference name",) => {
   return res.status(statusCode).json({
      status: "failed",
      message
   })
}


module.exports = sendReferenceError;
