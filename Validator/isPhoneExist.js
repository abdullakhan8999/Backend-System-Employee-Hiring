const models = require("../Models");

module.exports = async (phone) => {

   let isEmailExistInCompany = await models.company.findOne({ phone }).select("+password");
   let isEmailExistInAdmin = await models.admin.findOne({ phone }).select("+password");
   let isEmailExistInStudent = await models.student.findOne({ phone }).select("+password");


   return isEmailExistInCompany || isEmailExistInAdmin || isEmailExistInStudent;
}