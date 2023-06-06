const models = require("../Models");

module.exports = async (email, password) => {
   let isEmailExistInCompany, isEmailExistInAdmin, isEmailExistInStudent;

   if (password) {
      isEmailExistInCompany = await models.company.findOne({ email }).select("+password");
      isEmailExistInAdmin = await models.admin.findOne({ email }).select("+password");
      isEmailExistInStudent = await models.student.findOne({ email }).select("+password");

      return isEmailExistInCompany || isEmailExistInAdmin || isEmailExistInStudent;
   }
   isEmailExistInCompany = await models.company.findOne({ email });
   isEmailExistInAdmin = await models.admin.findOne({ email });
   isEmailExistInStudent = await models.student.findOne({ email });

   return isEmailExistInCompany || isEmailExistInAdmin || isEmailExistInStudent;

}
