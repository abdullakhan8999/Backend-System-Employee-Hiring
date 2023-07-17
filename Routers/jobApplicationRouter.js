const express = require('express');
const jobApplicationRouter = express.Router();
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
jobApplicationRouter
   .route('/apply/job')
   .post(
      isAuthenticatedUser,
      authorizedRoles(Roles.STUDENT),
      applyForJob
   );

// get all job applications
jobApplicationRouter
   .route('/company/job/applications')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllApplication
   );

// get job applications
jobApplicationRouter
   .route('/company/job/application')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getApplicationId
   );

// update job applications
jobApplicationRouter
   .route('/company/update/jobApplication')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.COMPANY),
      updateApplicationStatus
   );

//delete job by id
jobApplicationRouter
   .route('/delete/job/application')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.COMPANY, Roles.ENGINEER),
      deleteApplicationById
   );

module.exports = jobApplicationRouter;
