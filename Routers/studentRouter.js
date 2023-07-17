const express = require('express');
const studentRouter = express.Router();
const { Roles } = require("../Constants/rolesConstants");

// Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");

// Controllers
const {
   getAllStudents,
   getStudentDetails,
} = require("../Controller/studentController")




studentRouter.route('/admin/students')
   .get(isAuthenticatedUser, authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER), getAllStudents);


studentRouter.route('/student/details')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getStudentDetails);


module.exports = studentRouter;
