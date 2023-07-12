const express = require('express');
const router = express.Router();
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


router.route('/admin/students/:role')
   .get(isAuthenticatedUser, authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER), getAllStudents);

router.route('/companies/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllCompanies
   );

router.route('/student/details/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER),
      getStudentDetails);

router.route('/company/details/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getCompanyDetails);

router.route('/delete/user/:role')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.ENGINEER),
      deleteUser
   );


module.exports = router;
