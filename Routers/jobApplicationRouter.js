const express = require('express');
const router = express.Router();
const { Roles } = require("../Constants/rolesConstants");

// Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");

//controller
const {
   applyForJob,
   getAllApplication,
   getApplicationId,
   updateApplicationStatus,
   deleteApplicationById
} = require("../Controller/JobApplicationController")



//apply for the job
router
   .route('/apply/job/:role')
   .post(
      isAuthenticatedUser,
      authorizedRoles(Roles.STUDENT),
      applyForJob
   );

// get all job applications
router
   .route('/company/job/applications/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER),
      getAllApplication
   );

// get job applications
router
   .route('/company/job/application/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER),
      getApplicationId
   );

// update job applications
router
   .route('/company/update/jobApplication/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.COMPANY),
      updateApplicationStatus
   );

//delete job by id
router
   .route('/delete/job/application/:role')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER),
      deleteApplicationById
   );

module.exports = router;
