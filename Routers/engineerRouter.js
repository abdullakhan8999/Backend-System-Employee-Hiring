const express = require('express');
const router = express.Router();
const { Roles } = require('../Constants/rolesConstants');
const { isAuthenticatedUser, authorizedRoles } = require('../Middleware/auth');
const {
   getEngineerDetails,
   getAllEngineer,
   UpdateEngineerStatus,
   deleteEngineer
} = require('../Controller/engineerController');


// get a Engineer
router
   .route('/admin/get/engineerDetailed/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.ENGINEER),
      getEngineerDetails
   )

// get all Engineer
router
   .route('/admin/get/engineers/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN),
      getAllEngineer
   )

// Update Engineer
router
   .route('/admin/update/engineer/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN),
      UpdateEngineerStatus
   )

// delete Engineer
router
   .route('/admin/delete/engineer/:role')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN),
      deleteEngineer
   )

module.exports = router;
