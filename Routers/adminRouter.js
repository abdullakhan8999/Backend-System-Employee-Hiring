const express = require('express');
const router = express.Router();
const { ROLES } = require("../Constants/rolesConstants");

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
   .get(isAuthenticatedUser, authorizedRoles(ROLES[0], ROLES[3]), getAllStudents);

router.route('/companies/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      getAllCompanies
   );

router.route('/student/details/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(ROLES[0], ROLES[2], ROLES[3]),
      getStudentDetails);

router.route('/company/details/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      getCompanyDetails);

router.route('/delete/user/:role')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(ROLES[0], ROLES[3]),
      deleteUser
   );


module.exports = router;
