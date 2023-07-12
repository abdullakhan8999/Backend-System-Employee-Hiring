const express = require('express');
const router = express.Router();

//Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");
//Controllers
const { SignUp, login, logout, UpdateUserDetails, UpdateUserPassword } = require("../Controller/authController");
const { ROLES, Roles } = require('../Constants/rolesConstants');

router.route('/register/:role').post(SignUp);
router.route('/login/:role').post(login)
router.route('/logout/:role').get(isAuthenticatedUser, logout);

router.route('/update/details/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.ENGINEER, Roles.STUDENT, Roles.COMPANY),
      UpdateUserDetails
   );

router.route('/update/password/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.ENGINEER, Roles.STUDENT, Roles.COMPANY),
      UpdateUserPassword
   );

module.exports = router;