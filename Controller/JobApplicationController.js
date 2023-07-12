const models = require("../Models");
const {
   ValidateApplyForJob,
   ValidateApplicationId,
   ValidateUpdateApplicationStatus,
   ValidateDeleteApplicationById,
   IdValidation
} = require("../Validator");
const { JOB_STATUSES, JOB_APPLICATION_STATUSES } = require("../Constants/jobApplicationConstants");




// Apply for job
const applyForJob = async (req, res, next) => {
   //validation
   let { error } = await ValidateApplyForJob(req.body);
   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }

   // Job id validation
   const { job_id } = req.body;
   const student_id = req.user.id;
   if (!job_id || job_id.length !== 24) {
      return IdValidation(res);
   };

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

   //check if student applying to same job or not
   let studentJobApplications = await student.appliedJobs.map(id => id.toString());
   if (studentJobApplications.includes(job_id)) {
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
   });


   student.appliedJobs.push(job._id);
   await student.save();
   company.jobApplications.push(jobApplication._id);
   await company.save();
   job.jobApplications.push(jobApplication._id);
   await job.save();

   res.status(200).json({
      status: "success",
      message: "Job application created successfully",

      jobApplication,
   });
}
// get all jobs applications
const getAllApplication = async (req, res, next) => {
   const applications = await models.jobApplications.find();
   if (applications.length == 0) {
      return res.status(200).json({
         status: "success",
         message: "No applications.",
      });
   }
   res
      .status(200)
      .json({
         status: 'success',
         data: applications
      })
}
const getApplicationId = async (req, res, next) => {
   //validation
   let { error } = await ValidateApplicationId(req.body);

   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }
   const application = await models.jobApplications.findById(req.body.application_id);
   if (!application) {
      return res.status(404).json({
         status: "Failed",
         message: "Application not found.",
      });
   };

   res
      .status(200)
      .json({
         status: 'success',
         data: application
      })
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
      let application = await models.jobApplications.findById(req.body.application_id)
      if (!application) {
         return res.status(404).json({
            status: "Failed",
            message: "Application not found.",
         });
      };
      application.applicationStatus = req.body.application_status;

      application.save();

      res
         .status(200)
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
   //validation
   let { error } = await ValidateDeleteApplicationById(req.body);
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
            let filteredApplications = await job.jobApplications.filter((app) => {
               return app.toString() !== req.body.application_id;
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