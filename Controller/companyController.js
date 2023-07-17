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

      // Query validation
      let allowedKeys = ["name", "location"];
      //query filter
      const filteredQuery = Object.keys(req.query).filter(key =>
         !allowedKeys.includes(key)
      );
      if (filteredQuery.length > 0) {
         console.log("Invalid query: " + filteredQuery.join(", "));
         return res.status(400).json({
            status: 'failed',
            message: "Invalid search: " + filteredQuery.join(", ")
         });
      }

      // Request query
      const apiFeatures = new ApiFeatures(models.company.find(), req.query)
         .searchByName()
         .searchByLocation()

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


const getCompanyDetails = async (req, res, next) => {
   let company;
   try {
      //user role is company 
      if (!req.body.company_id && req.user.role == "company") {
         company = await models.company.findById(req.user.id)
         let response = { ...RESPONSES.COMPANY.GET_DETAILS_SUCCESS, company }
         res.status(200)
            .json(response)
      } else {
         //check for id validation
         if (req.body.company_id.length !== 24) {
            console.log("Company id validation failed");
            return IdValidation(res);
         }

         // Access studentId from request body
         const companyId = req.body.company_id;

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
}