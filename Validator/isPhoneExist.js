const models = require("../Models");

module.exports = async (phone) => {
   let isEmailExistInStudent = await models.student.findOne({ phone });
   return isEmailExistInStudent;
}