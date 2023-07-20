const express = require('express');
const authRouter = express.Router();

//Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");
//Controllers
const { SignUp, login, logout, UpdateUserDetails, UpdateUserPassword, getUserDetails } = require("../Controller/authController");
const { Roles } = require('../Constants/rolesConstants');

authRouter.route('/register').post(SignUp);
authRouter.route('/login').post(login)
authRouter.route('/logout').get(isAuthenticatedUser, logout);
authRouter.route('/me').get(isAuthenticatedUser, getUserDetails);

authRouter.route('/update/details')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.ENGINEER, Roles.STUDENT, Roles.COMPANY),
      UpdateUserDetails
   );

authRouter.route('/update/password')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.ENGINEER, Roles.STUDENT, Roles.COMPANY),
      UpdateUserPassword
   );

module.exports = authRouter;