const models = require("../Models");
const {
   ValidateApplyForJob,
   ValidateJob,
   ValidateApplicationId,
   ValidateUpdateJobDetails,
   ValidateUpdateApplicationStatus,
   ValidateDeleteJobById,
   ValidateDeleteApplicationById
} = require("../Validator");
const ApiFeatures = require("../Utils/ApiFeatures");

// jobs 
// create a new job
const createJob = async (req, res, next) => {
   //validation
   let { error } = await ValidateJob(req.body);

   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }

   const {
      title,
      description,
      company_id,
      company_name,
      location,
      requirement,
      experience,
      salary
   } = req.body;


   // Validate company_id length
   if (!company_id || company_id.length !== 24) {
      return res.status(400).json({
         status: "failed",
         message: "Invalid company_id.",
      });
   }

   // Check if the company exists
   const isCompany = await models.company.findById(company_id);

   if (!isCompany) {
      return res.status(404).json({
         status: "failed",
         message: "Company not found.",
      });
   }
   if (isCompany.companyName != company_name) {
      return res.status(404).json({
         status: "failed",
         message: "Company not found.",
      });
   }

   models.job.create({
      title,
      description,
      company_id,
      company_name,
      location,
      requirement,
      experience,
      salary
   }).then(async (job) => {
      isCompany.jobs.push(job._id);
      await isCompany.save();
      res.status(200).json({
         status: 'success',
         message: 'Job created successfully',
         job
      });
   }).catch((error) => {
      res.status(500).json({
         status: 'failed',
         message: 'Internal error!' + error,
         job
      });
   })


}
// get all jobs
const getAllJobs = async (req, res, next) => {
   try {
      // Check if there are no query parameters, and return all jobs
      if (Object.keys(req.query).length === 0) query = models.job.find();

      // Request query
      const apiFeatures = new ApiFeatures(models.job.find(), req.query)
         .searchByTitle()
         .searchByCompany()
         .searchByLocation()
         .filterByExperience()
         .filterBySalary()

      // Execute the final query
      const jobs = await apiFeatures.query;

      res.status(200).json({
         status: 'success',
         results: jobs.length,
         data: {
            jobs,
         },
      });
   } catch (error) {
      res.status(500).json({
         status: 'error',
         message: 'Internal server error' + error,
      });
   }
};

// get a job
const getJobDetailsId = async (req, res, next) => {
   const { job_id } = req.body;
   await models.job.findById(job_id)
      .then((job) => {
         res.status(200).json({
            status: 'success',
            job
         })
      }).catch((err) => {
         return res.status(500).json({
            status: "failed",
            message: "Internal error:" + err,
         });
      });
}

// update Job Details by Id
const updateJobDetailsId = async (req, res, next) => {
   //validation
   let { error } = await ValidateUpdateJobDetails(req.body);

   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }


   const updateJob = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      requirement: req.body.requirement,
      experience: req.body.experience,
      salary: req.body.salary,
   }
   await models.job.findByIdAndUpdate(req.body.job_id, updateJob, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
   })
      .then((job) => {
         res.status(200).json({
            status: 'success',
            job
         })
      }).catch((err) => {
         return res.status(500).json({
            status: "failed",
            message: "Internal error:" + err,
         });
      });
}

// delete Job by Id
const deleteJobById = async (req, res, next) => {
   //validation
   let { error } = await ValidateDeleteJobById(req.body);

   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }
   await models.job.deleteOne(req.body.job_id)
      .then(() => {
         res.status(200).json({
            status: 'success',
            message: 'Job deleted successfully'
         })
      }).catch((err) => {
         return res.status(500).json({
            status: "failed",
            message: "Internal error:" + err,
         });
      });
}


// Job application
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

   const { student_id, job_id } = req.body;
   // Validate company_id length
   if (!student_id || student_id.length !== 24) {
      return res.status(400).json({
         status: "failed",
         message: "Invalid student_id.",
      });
   };

   if (!job_id || job_id.length !== 24) {
      return res.status(400).json({
         status: "failed",
         message: "Invalid job_id.",
      });
   };

   const student = await models.student.findById(student_id);
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
   const UpdateStatus = {
      applicationStatus: req.body.application_status
   }

   await models.jobApplications.findByIdAndUpdate(req.body.application_id, UpdateStatus, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
   }).then((application) => {
      res
         .status(200)
         .json({
            status: 'success',
            data: application
         })
   }).catch((err) => {
      return res.status(404).json({
         status: "Failed",
         message: "Error in updating job application: " + err,
      });
   });
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
   await models.job.deleteOne(req.body.application_id)
      .then(() => {
         res.status(200).json({
            status: 'success',
            message: 'Job deleted successfully'
         })
      }).catch((err) => {
         return res.status(500).json({
            status: "failed",
            message: "Internal error:" + err,
         });
      });
}

module.exports = {
   createJob,
   getAllJobs,
   applyForJob,
   getJobDetailsId,
   getAllApplication,
   getApplicationId,
   updateJobDetailsId,
   updateApplicationStatus,
   deleteJobById,
   deleteApplicationById
}