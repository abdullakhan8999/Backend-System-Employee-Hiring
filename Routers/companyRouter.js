const express = require('express');
const companyRouter = express.Router();
const { Roles } = require("../Constants/rolesConstants");

// Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");
const {
   getAllCompanies,
   getCompanyDetails,
   getAllCompaniesByName,
} = require("../Controller/companyController");

companyRouter.route('/company/details/:company_id')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getCompanyDetails);

companyRouter.route('/search/companies')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllCompaniesByName);

companyRouter
   .route('/companies')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllCompanies
   );


module.exports = companyRouter;