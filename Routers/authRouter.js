const express = require('express');
const router = express.Router();

//Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");
//Controllers
const { SignUp, login, logout, UpdateUserDetails, UpdateUserPassword } = require("../Controller/authController");
const { ROLES } = require('../Constants/rolesConstants');

router.route('/register/:role').post(SignUp);
router.route('/login/:role').post(login)
router.route('/logout/:role').get(isAuthenticatedUser, logout);

router.route('/update/details/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(ROLES[1], ROLES[2]),
      UpdateUserDetails
   );

router.route('/update/password/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(ROLES[1], ROLES[2]),
      UpdateUserPassword
   );

module.exports = router;