const express = require('express');
const router = express.Router();
const { ROLES } = require("../Constants/rolesConstants");

// Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");

//controller
const {
   createJob,
   applyForJob,
   getAllJobs,
   getJobDetailsId,
   getAllApplication,
   getApplicationId,
   updateJobDetailsId,
   updateApplicationStatus,
   deleteJobById
} = require("../Controller/jobController")

//Job

//create a new job
router
   .route('/company/create/job/:role')
   .post(
      isAuthenticatedUser,
      authorizedRoles(ROLES[2]),
      createJob
   );

//get all job
router
   .route('/jobs/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      getAllJobs
   );

//get job by id
router
   .route('/job_id/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      getJobDetailsId
   );

//update job by id
router
   .route('/company/update/job/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(ROLES[2]),
      updateJobDetailsId
   );

//delete job by id
router
   .route('/company/delete/job/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(ROLES[0], ROLES[2]),
      deleteJobById
   );



//Job Application
//apply for the job
router
   .route('/apply/job/:role')
   .post(
      isAuthenticatedUser,
      authorizedRoles(ROLES[1]),
      applyForJob
   );

// get all job applications
router
   .route('/company/job/applications/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(ROLES[0], ROLES[2]),
      getAllApplication
   );

// get job applications
router
   .route('/company/job/application/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(ROLES[0], ROLES[2]),
      getApplicationId
   );

// update job applications
router
   .route('/update/job/application/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(ROLES[2]),
      updateApplicationStatus
   );

//delete job by id
router
   .route('/delete/job/application/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(ROLES[0], ROLES[2]),
      deleteJobById
   );

module.exports = router;
