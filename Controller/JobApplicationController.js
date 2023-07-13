const models = require("../Models");
const {
   ValidateUpdateApplicationStatus,
   IdValidation
} = require("../Validator");
const { JOB_STATUSES, JOB_APPLICATION_STATUSES } = require("../Constants/jobApplicationConstants");
const ApiFeatures = require("../Utils/ApiFeatures");
const sendReferenceError = require("../Utils/sendReferenceErrorRES");

// Apply for job
const applyForJob = async (req, res, next) => {
   // Job id validation
   if (!req.body.job_id || req.body.job_id.length !== 24) {
      return IdValidation(res);
   };

   if (!req.body.title) {
      return await sendReferenceError(400, res, "Job Title is required");
   }

   const { job_id, title } = req.body;
   const student_id = req.user.id;

   const student = await models.student.findById(req.user.id);
   if (!student) {
      return res.status(404).json({
         status: "failed",
         message: "Student not found.",
      });
   }
   const job = await models.job.findById(job_id);
   if (!job) {
      return res.status(404).json({
         status: "failed",
         message: "Job not found.",
      });
   }

   //check if student applying again to same job or not
   if (student.appliedJobs.includes(job_id)) {
      return res.status(400).json({
         status: "failed",
         message: "Already applied to this job.",
      });
   }

   //Check if the company is hiring
   if (job.hiring_status == JOB_STATUSES.Hiring_Status_Closed) {
      return res.status(400).json({
         status: "failed",
         message: "Job hiring is completed",
      });
   }

   //Check if the company is title
   if (job.title !== title) {
      return res.status(400).json({
         status: "failed",
         message: "Incorrect job title.",
      });
   }

   // Associate job application with the company
   const company = await models.company.findById(job.company_id);
   if (!company) {
      return res.status(404).json({
         status: "failed",
         message: "Company not found.",
      });
   }

   // Create job application
   const jobApplication = await models.jobApplications.create({
      job_id,
      student_id,
      title
   });

   //Update job application, student and company
   student.appliedJobs.push(job._id);
   await student.save();
   company.jobApplications.push(jobApplication._id);
   await company.save();
   job.jobApplications.push(jobApplication._id);
   await job.save();

   //send responses
   res.status(200).json({
      status: "success",
      message: "Job application created successfully",
      jobApplication,
   });
}

// get all jobs applications
const getAllApplication = async (req, res, next) => {
   let applications;
   if (req.user.role == "student") {
      // Check if there is not query parameters
      if (Object.keys(req.query).length === 0) {
         const applications = await models.jobApplications.find({ student_id: req.user.id }).exec();
         if (applications.length == 0) {
            return res.status(200).json({
               status: "success",
               message: "No applications.",
            });
         }
         return res.status(200).json({
            status: 'success',
            results: applications.length,
            applications
         });
      }
      // else return query results
      const apiFeatures = new ApiFeatures(models.jobApplications.find({ student_id: req.user.id }), req.query)
         .searchByApplicationStatus()
         .searchByTitle()

      applications = await apiFeatures.query.exec();

      res
         .status(200)
         .json({
            status: 'success',
            results: applications.length,
            data: applications
         })
   } else {

      // Check if there is not query parameters
      if (Object.keys(req.query).length === 0) {
         const applications = await models.jobApplications.find().exec();
         if (applications.length == 0) {
            return res.status(200).json({
               status: "success",
               message: "No applications.",
            });
         }
         return res.status(200).json({
            status: 'success',
            results: applications.length,
            applications
         });
      }
      // else return query results
      const apiFeatures = new ApiFeatures(models.jobApplications.find(), req.query)
         .searchByApplicationStatus()
         .searchByTitle()
         .searchByStudentId()

      applications = await apiFeatures.query.exec();

      res
         .status(200)
         .json({
            status: 'success',
            results: applications.length,
            data: applications
         })
   }
}

const getApplicationId = async (req, res, next) => {

   //check for id validation
   if (!req.body.application_id || req.body.application_id.length !== 24) {
      return IdValidation(res);
   }

   //finding application
   let application;
   if (req.user.role == "student") {
      //getting the application
      application = await models.jobApplications.findById(req.body.application_id);

      // checking the application is available or not
      if (!application) {
         return res.status(404).json({
            status: "Failed",
            message: "Application not found.",
         });
      };

      // check if the applied user and requested user is same or not
      if (application.student_id !== req.user.id) {
         return res.status(404).json({
            status: "Failed",
            message: "Not authorized roles to access."
         });
      }

      // send response
      res.status(200)
         .json({
            status: 'success',
            data: application
         })
   } else {
      // Get application
      application = await models.jobApplications.findById(req.body.application_id);
      if (!application) {
         return res.status(404).json({
            status: "Failed",
            message: "Application not found.",
         });
      };

      // send response
      res.status(200)
         .json({
            status: 'success',
            data: application
         })
   }
}

const updateApplicationStatus = async (req, res, next) => {
   //validation
   let { error } = await ValidateUpdateApplicationStatus(req.body);
   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }

   //check for id validation
   if (!req.body.application_id || req.body.application_id.length !== 24) {
      return IdValidation(res);
   }

   //check for UpdateStatus validation
   if (!Object.values(JOB_APPLICATION_STATUSES).includes(req.body.application_status)) {
      return res.status(400).json({
         status: "Failed",
         message: "Application status is not valid."
      });
   }


   try {
      //get Application
      let application = await models.jobApplications.findById(req.body.application_id)
      if (!application) {
         return res.status(404).json({
            status: "Failed",
            message: "Application not found.",
         });
      };

      //check if the applied student is there or not 
      let student = await models.student.findById(application.student_id);
      if (!student) {
         return res.status(400).json({
            status: "Failed",
            message: "Student not found."
         });
      }

      //update application
      application.applicationStatus = req.body.application_status;
      await application.save();

      // responses
      res.status(200)
         .json({
            status: 'success',
            message: 'Application updated successfully',
            data: application

         })

   } catch (err) {
      return res.status(404).json({
         status: "Failed",
         message: "Error in updating job application: " + err,

      });
   }
}

// delete Job by Id
const deleteApplicationById = async (req, res, next) => {
   //check for id validation
   if (!req.body.application_id || req.body.application_id.length !== 24) {
      return IdValidation(res);
   }

   try {
      //Check for application
      let application = await models.jobApplications.findById(req.body.application_id);
      if (!application) {
         return res.status(404).json({
            status: "Failed",
            message: "Application not found.",
         });
      };

      //Delete the job application
      await models.jobApplications.deleteOne({ _id: req.body.application_id })
         .then(async () => {
            let jobId = await application.job_id.toString()
            let job = await models.job.findById(jobId);
            // Apply filter condition job 
            let filteredApplications = await job.jobApplications.filter((JOB) => {
               return JOB.toString() !== req.body.application_id;
            });
            job.jobApplications = filteredApplications;
            // // Save the updated job document
            await job.save();

            let studentId = await application.student_id.toString();
            let student = await models.student.findById(studentId);
            // Apply filter condition student
            let filStuJobApp = await student.appliedJobs.filter((JOB) => {
               return JOB.toString() !== jobId;
            });
            student.appliedJobs = filStuJobApp;
            // Save the updated student document
            await student.save();
         }).catch((err) => {
            return res.status(500).json({
               status: "failed",
               message: "Internal error:" + err,
            });
         });

      //Deleted successfully
      res.status(200).json({
         status: 'success',
         message: 'Job deleted successfully'
      })
   } catch (err) {
      return res.status(500).json({
         status: "failed",
         message: "Internal error:" + err,
      });
   }
}

module.exports = {
   applyForJob,
   getAllApplication,
   getApplicationId,
   updateApplicationStatus,
   deleteApplicationById
}