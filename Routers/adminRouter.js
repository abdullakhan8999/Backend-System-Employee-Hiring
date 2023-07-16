const express = require('express');
const adminRouter = express.Router();
const { Roles } = require("../Constants/rolesConstants");

// Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");

// Controllers
const {
   getAllStudents,
   getAllCompanies,
   getStudentDetails,
   getCompanyDetails,
   deleteUser
} = require("../Controller/adminController.js")


adminRouter.route('/admin/students/:role')
   .get(isAuthenticatedUser, authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER), getAllStudents);

adminRouter.route('/companies/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllCompanies
   );

adminRouter.route('/student/details/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getStudentDetails);

adminRouter.route('/company/details/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getCompanyDetails);

adminRouter.route('/delete/user/:role')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.ENGINEER),
      deleteUser
   );


module.exports = adminRouter;
