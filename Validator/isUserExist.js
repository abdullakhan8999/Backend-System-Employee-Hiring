const models = require("../Models");

module.exports = async (id) => {

   let isUserExistInCompany = await models.company.findById(id).select("+password");
   let isUserExistInStudent = await models.student.findById(id).select("+password");


   return isUserExistInCompany || isUserExistInStudent;
}