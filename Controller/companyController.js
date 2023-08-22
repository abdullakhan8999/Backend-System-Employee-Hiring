const RESPONSES = require("../Constants/RESPONSES");
const models = require("../Models");
const ApiFeatures = require("../Utils/ApiFeatures");
const { IdValidation, } = require("../Validator");



const getAllCompanies = async (req, res, next) => {
   try {
      let companies;
      // Check if there are no query parameters, and return all jobs
      if (Object.keys(req.query).length === 0) {
         companies = await models.company.find();
         // sending results 
         let results = companies.length;
         let responses = { ...RESPONSES.COMPANY.GET_ALL_SUCCESS, results, companies };
         return res.status(200).json(responses);
      };

      // Request query
      const apiFeatures = new ApiFeatures(models.company.find(), req.query)
         .searchCompany()
         .filterByCompanyCategories()

      // Execute the final query
      companies = await apiFeatures.query;
      let results = companies.length;
      let response = { ...RESPONSES.COMPANY.GET_ALL_SUCCESS, results, companies }
      res.status(200).json(response);
   } catch (error) {
      res.status(401)
         .json(RESPONSES.COMPANY.GET_ALL_FAILED)
   }
   next();
}
// get All Companies By Name
const getAllCompaniesByName = async (req, res, next) => {
   try {
      const apiFeature = new ApiFeatures(models.company.find(), req.query)
         .searchInByName()

      let companies = await apiFeature.query;
      let results = companies.length;
      let response = { ...RESPONSES.COMPANY.GET_ALL_SUCCESS, results, companies }
      res.status(200).json(response);
   } catch (error) {
      res.status(401)
         .json(RESPONSES.COMPANY.GET_ALL_FAILED)
   }
   next();

}

const getCompanyDetails = async (req, res, next) => {
   let company;
   try {
      //user role is company 
      if (req.user.role == "company" && !req.params.company_id) {
         company = await models.company.findById(req.user.id)
         let response = { ...RESPONSES.COMPANY.GET_DETAILS_SUCCESS, company }
         res.status(200)
            .json(response)
      } else {
         //check for id validation
         if (req.params.company_id === undefined || req.params.company_id.length !== 24) {
            console.log("Company id validation failed");
            return IdValidation(res);
         }

         // Access studentId from request body
         const companyId = req.params.company_id;

         company = await models.company.findById(companyId)
         if (!company) {
            console.log("Company not found");
            return res.status(404).json(RESPONSES.COMPANY.GET_DETAILS_FAILED)
         }

         let response = { ...RESPONSES.COMPANY.GET_DETAILS_SUCCESS, company }
         res.status(200)
            .json(response);
      }
   } catch (error) {
      console.log("Error while finding company:", error);
      res.status(400).json(RESPONSES.COMPANY.GET_DETAILS_FAILED)
   }
   next();
}

module.exports = {
   getAllCompanies,
   getCompanyDetails,
   getAllCompaniesByName
}