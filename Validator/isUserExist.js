const models = require("../Models");

module.exports = async (id) => {


   let isUserExistInCompany = await models.company.findById(id).select("+password");
   let isUserExistInUser = await models.user.findById(id).select("+password");


   return isUserExistInCompany || isUserExistInUser
}