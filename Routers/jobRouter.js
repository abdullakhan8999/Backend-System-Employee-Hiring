const express = require('express');
const jobRouter = express.Router();
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
   getAllJobsByTitle,
} = require("../Controller/jobController")

//Job

//create a new job
jobRouter
   .route('/company/create/job')
   .post(
      isAuthenticatedUser,
      authorizedRoles(Roles.COMPANY),
      createJob
   );

//get all job
jobRouter
   .route('/jobs')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllJobs
   );

//get jobs by title
jobRouter
   .route('/search/jobs')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllJobsByTitle
   );

//get job by id
jobRouter
   .route('/job/:jobId')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getJobDetailsId
   );

//update job by id
jobRouter
   .route('/company/update/job')
   .put(
      isAuthenticatedUser,
      authorizedRoles(Roles.COMPANY),
      updateJobDetailsId
   );

//delete job by id
jobRouter
   .route('/company/delete/job/:jobId')
   .delete(
      isAuthenticatedUser,
      authorizedRoles(Roles.ADMIN, Roles.COMPANY),
      deleteJobById
   );

module.exports = jobRouter;
