const express = require('express');
const router = express.Router();
const { Roles } = require("../Constants/rolesConstants");

// Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");

//controller
const {
   createJob,
   getAllJobs,
   getJobDetailsId,
   updateJobDetailsId,
   deleteJobById,
} = require("../Controller/jobController")

//Job

//create a new job
router
   .route('/company/create/job/:role')
   .post(
      isAuthenticatedUser,
      authorizedRoles(Roles.COMPANY),
      createJob
   );

//get all job
router
   .route('/jobs/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllJobs
   );

//get job by id
router
   .route('/job_id/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getJobDetailsId
   );

//update job by id
router
   .route('/company/update/job/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.COMPANY),
      updateJobDetailsId
   );

//delete job by id
router
   .route('/company/delete/job/:role')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.COMPANY),
      deleteJobById
   );

module.exports = router;
