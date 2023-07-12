const models = require("../Models");

module.exports = async (email, password) => {
   let isEmailExistInCompany, isEmailExistInAdmin, isEmailExistInStudent, isEmailExistInEngineer;

   if (password != null || password != undefined) {
      isEmailExistInAdmin = await models.admin.findOne({ email }).select("+password").exec();
      isEmailExistInStudent = await models.student.findOne({ email }).select("+password").exec();
      isEmailExistInCompany = await models.company.findOne({ email }).select("+password").exec();
      isEmailExistInEngineer = await models.engineer.findOne({ email }).select("+password").exec();
      return isEmailExistInCompany || isEmailExistInAdmin || isEmailExistInStudent || isEmailExistInEngineer;
   }

   isEmailExistInCompany = await models.company.findOne({ email }).exec();
   isEmailExistInAdmin = await models.admin.findOne({ email }).exec();
   isEmailExistInStudent = await models.student.findOne({ email }).exec();
   isEmailExistInEngineer = await models.engineer.findOne({ email }).exec();
   return isEmailExistInCompany || isEmailExistInAdmin || isEmailExistInStudent || isEmailExistInEngineer;
}
