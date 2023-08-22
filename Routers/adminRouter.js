const express = require('express');
const adminRouter = express.Router();
const { Roles } = require("../Constants/rolesConstants");

// Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");

// Controllers
const {
   deleteUser,
   UpdateEngineerStatus,
   deleteEngineer,
   getAllEngineer,
   getEngineerDetails
} = require("../Controller/adminController.js")

// get a Engineer
adminRouter
   .route('/get/engineerDetailed')
   .get(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.ENGINEER),
      getEngineerDetails
   )


// Update Engineer
adminRouter
   .route('/admin/update/engineer/status')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN),
      UpdateEngineerStatus
   )

adminRouter.route('/delete/user/:userId')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.ENGINEER),
      deleteUser
   );

adminRouter.route('/admin/delete/engineer/:')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN),
      deleteEngineer
   )

// get all Engineer
adminRouter
   .route('/admin/get/engineers')
   .get(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN),
      getAllEngineer
   )



module.exports = adminRouter;
