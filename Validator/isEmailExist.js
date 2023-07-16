const models = require("../Models");

module.exports = async (email, password) => {
   let isEmailExistInCompany, isEmailExistInUser;

   if (password != null || password != undefined) {
      isEmailExistInUser = await models.user.findOne({ email }).select("+password").exec();
      isEmailExistInCompany = await models.company.findOne({ email }).select("+password").exec();
      return isEmailExistInCompany || isEmailExistInUser;
   }

   isEmailExistInCompany = await models.company.findOne({ email }).exec();
   isEmailExistInUser = await models.user.findOne({ email }).exec();
   return isEmailExistInCompany || isEmailExistInUser;
}
