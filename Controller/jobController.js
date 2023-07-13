const models = require("../Models");
const {
   ValidateJob,
   IdValidation
} = require("../Validator");
const ApiFeatures = require("../Utils/ApiFeatures");
const { JOB_STATUSES, JOB_APPLICATION_STATUSES } = require("../Constants/jobApplicationConstants");

// jobs 
// create a new job
const createJob = async (req, res, next) => {
   // req body validation
   let { error } = await ValidateJob(req.body);
   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }

   let {
      title,
      description,
      company_id,
      company_name,
      location,
      requirement,
      experience,
      salary,
      vacancies,
      hiring_status
   } = req.body;


   // Validate company_id length
   if (!company_id || company_id.length !== 24) {
      return IdValidation(res);
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
         message: "Enter valid company name",
      });
   }
   hiring_status = hiring_status.toLowerCase()
   if (!Object.values(JOB_STATUSES).includes(hiring_status.toLowerCase())) {
      return res.status(404).json({
         status: "failed",
         message: "Enter valid hiring status: " + hiring_status,
      });
   }

   try {
      // create a new job
      let job = await models.job.create({
         title,
         description,
         company_id,
         company_name,
         location,
         requirement,
         experience,
         salary,
         vacancies,
         hiring_status
      })

      // save job id in company model
      isCompany.jobs.push(job._id);
      await isCompany.save();

      //response
      res.status(200).json({
         status: 'success',
         message: 'Job created successfully',
         job
      });
   } catch (error) {
      res.status(500).json({
         status: 'failed',
         message: 'Internal error!' + error,
      });
   }
}

// get all jobs
const getAllJobs = async (req, res, next) => {
   try {
      // Check if there is not query parameters
      if (Object.keys(req.query).length === 0) {
         const jobs = await models.job.find().exec();
         return res.status(200).json({
            status: 'success',
            results: jobs.length,
            jobs
         });
      }

      // else return query results
      const apiFeatures = new ApiFeatures(models.job.find(), req.query)
         .searchByTitle()
         .searchByCompany()
         .searchByLocation()
         .filterByExperience()
         .filterBySalary();

      const jobs = await apiFeatures.query.exec();

      res.status(200).json({
         status: 'success',
         results: jobs.length,
         jobs
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: 'error',
         message: 'Internal server error',
      });
   }
};

// get a job
const getJobDetailsId = async (req, res, next) => {
   try {
      //check for id validation
      if (!req.body.jobId || req.body.jobId.length !== 24) {
         return IdValidation(res);
      }

      // access job id from request body
      const { jobId } = req.body;

      // find job by jobId
      let job = await models.job.findById(jobId);

      // if not found
      if (!job) {
         return res.status(404).json({
            status: 'failed',
            message: 'Job not found for jobId: ' + jobId,
         })
      }

      // else send the job
      res.status(200).json({
         status: 'success',
         job
      })
   } catch (error) {
      return res.status(500).json({
         status: "failed",
         message: "Internal error:" + error,
      });
   }
}

// update Job Details by Id
const updateJobDetailsId = async (req, res, next) => {
   try {
      //check for id validation
      if (!req.body._id || req.body._id.length !== 24) {
         return IdValidation(res)
      }

      //  Update job details
      let job = await models.job.findById(req.body._id);
      // if not found
      if (!job) {
         return res.status(404).json({
            status: 'failed',
            message: 'Job not found for jobId: ' + req.body._id,
         })
      }

      // Does company has this job? validation
      let company = await models.company.findById(req.user.id);
      if (!company) {
         return res.status(404).json({
            status: 'failed',
            message: 'Company not found for jobId: ' + req.user.id,
         })
      }

      // let isJobExist = company.jobs.some((job) => job === req.body._id)
      let isJobExist = company.jobs.includes(req.body._id);
      if (!isJobExist) {
         return res.status(400).json({
            status: "failed",
            message: "Not authorized roles to access this route"
         });
      }


      // filter out valid fields
      const invalidFields = Object.keys(req.body).filter(key => !job.schema.path(key));
      // invalidField has any invalid fields
      if (invalidFields.length > 0) {
         return res.status(400).json({
            status: "failed",
            message: "Invalid fields: " + invalidFields.join(", ")
         });
      }

      //Update fields of jobs
      job.title = req.body.title ? req.body.title : job.title;
      job.description = req.body.description ? req.body.description : job.description;
      job.location = req.body.location ? req.body.location : job.location;
      job.requirement = req.body.requirement ? req.body.requirement : job.requirement;
      job.experience = req.body.experience ? req.body.experience : job.experience;
      job.salary = req.body.salary ? req.body.salary : job.salary;

      if (req.body.vacancies <= 0) {
         job.vacancies = 0;
         job.hiring_status = JOB_STATUSES.Hiring_Status_Closed
      } else {
         job.vacancies = req.body.vacancies;
         job.hiring_status = JOB_STATUSES.Hiring_Status_Open
      }

      await job.save();
      res.status(200).json({
         status: 'success',
         job
      })
   } catch (err) {
      return res.status(500).json({
         status: "failed",
         message: "Internal error:" + err,
      });
   };
}

const deleteJobById = async (req, res, next) => {
   // Delete job
   try {
      //check for id validation
      if (!req.body.job_id || req.body.job_id.length !== 24) {
         return IdValidation(res);
      }

      // Find job with job id
      const job = await models.job.findById(req.body.job_id);
      // if Job not found
      if (!job) {
         return res.status(404).json({
            status: "failed",
            message: "Job not found.",
         });
      }

      // Does company has this job? validation
      let company = await models.company.findById(req.user.id);
      if (!company) {
         return res.status(404).json({
            status: 'failed',
            message: 'Company not found for jobId: ' + req.user.id,
         })
      }

      // let isJobExist = company.jobs.some((job) => job === req.body._id)
      let isJobExist = company.jobs.includes(req.body.job_id);
      if (!isJobExist) {
         return res.status(400).json({
            status: "failed",
            message: "Not authorized roles to access this route"
         });
      }


      await models.job.deleteOne({ _id: job._id });

      // Update job applications
      let jobApplications = await models.jobApplications.find({ job_id: job._id });
      jobApplications.map(
         async (application) => {
            application.applicationStatus = JOB_APPLICATION_STATUSES.CLOSED
            await application.save()
         }
      )

      //deleted jobs
      res.status(200).json({
         status: 'success',
         message: 'Job deleted successfully'
      })
   } catch (err) {
      return res.status(500).json({
         status: "failed",
         message: "Internal error:" + err,
      });
   };
}




module.exports = {
   createJob,
   getAllJobs,
   getJobDetailsId,
   updateJobDetailsId,
   deleteJobById,
}