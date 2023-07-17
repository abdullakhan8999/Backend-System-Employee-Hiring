const models = require("../Models");
const {
   ValidateJob,
   IdValidation
} = require("../Validator");
const ApiFeatures = require("../Utils/ApiFeatures");
const { JOB_STATUSES, JOB_APPLICATION_STATUSES } = require("../Constants/jobApplicationConstants");
const RESPONSES = require("../Constants/RESPONSES");

// jobs 
// create a new job
const createJob = async (req, res, next) => {
   // req body validation
   let { error } = await ValidateJob(req.body);
   if (error) {
      console.log(error.details[0].message);
      return res.status(400).json(RESPONSES.VALIDATION_FAILED);
   }

   let {
      title,
      description,
      company_id = req.user.id,
      company_name = req.user.name,
      location,
      requirement,
      experience,
      salary,
      vacancies,
      hiring_status
   } = req.body;


   // Validate company_id length
   if (!company_id || company_id.length !== 24) {
      console.log("Invalid company:", company_id);
      return IdValidation(res);
   }

   // Check if the company exists
   const isCompany = await models.company.findById(company_id);
   if (!isCompany) {
      console.log("Company not found / Invalid company:", company_id);
      return res.status(404).json(RESPONSES.VALIDATION_FAILED);
   }
   if (isCompany.name != company_name) {
      console.log("Enter valid company name");
      return res.status(404).json(RESPONSES.VALIDATION_FAILED);
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
      let response = { ...RESPONSES.JOB.CREATE_SUCCESS, job }
      res.status(200).json(response);
   } catch (error) {
      console.log("Error with creating job: " + error);
      res.status(500).json(RESPONSES.JOB.CREATE_FAILED);
   }
}

// get all jobs
const getAllJobs = async (req, res, next) => {
   try {
      // Check if there is not query parameters
      if (Object.keys(req.query).length === 0) {
         const jobs = await models.job.find().exec();

         let results = jobs.length;
         let response = { ...RESPONSES.JOB.GET_ALL_SUCCESS, results, jobs }
         return res.status(200).json(response);
      }

      // else return query results
      const apiFeatures = new ApiFeatures(models.job.find(), req.query)
         .searchByTitle()
         .searchByCompany_name()
         .searchByLocation()
         .filterByExperience()
         .filterBySalary();

      const jobs = await apiFeatures.query.exec();

      let results = jobs.length;
      let response = { ...RESPONSES.JOB.GET_ALL_SUCCESS, results, jobs }
      res.status(200).json(response);
   } catch (error) {
      console.log("Error while getting jobs", error);
      res.status(500).json(RESPONSES.JOB.GET_ALL_FAILED);
   }
};

// get a job
const getJobDetailsId = async (req, res, next) => {
   try {
      //check for id validation
      if (!req.body.jobId || req.body.jobId.length !== 24) {
         console.log("Invalid job id", req.body.jobId);
         return IdValidation(res);
      }

      // access job id from request body
      const { jobId } = req.body;

      // find job by jobId
      let job = await models.job.findById(jobId);

      // if not found
      if (!job) {
         console.log("Job not found");
         return res.status(404).json(RESPONSES.JOB.GET_DETAILS_FAILED)
      }

      // else send the job
      let response = { ...RESPONSES.JOB.GET_DETAILS_SUCCESS, job };
      res.status(200).json(response);
   } catch (error) {
      console.log("Error while sending job", error);
      return res.status(500).json(RESPONSES.JOB.GET_DETAILS_FAILED);
   }
}

// update Job Details by Id
const updateJobDetailsId = async (req, res, next) => {
   try {
      //check for id validation
      if (!req.body.jobId || req.body.jobId.length !== 24) {
         console.log("Invalid job id: " + req.body.jobId);
         return IdValidation(res)
      }

      //  Update job details
      let job = await models.job.findById(req.body.jobId);
      // if not found
      if (!job) {
         console.log("Job not found");
         let response = { ...RESPONSES.JOB.GET_DETAILS_FAILED, ID: req.body.jobID };
         return res.status(404).json(response);
      }

      // Does company has this job? validation
      let company = await models.company.findById(req.user.id);
      if (!company) {
         let response = { ...RESPONSES.COMPANY.GET_DETAILS_FAILED };
         return res.status(404).json(response);
      }

      // isJobExist is company
      let isJobExist = company.jobs.includes(req.body.jobId);
      if (!isJobExist) {
         return res.status(400).json({
            status: "failed",
            message: "Not authorized roles to access this route"
         });
      }


      // filter out valid fields
      let fields = ["jobId", "title", "description", "location", "vacancies", "requirement", "experience", "salary"]
      const invalidFields = Object.keys(req.body).filter(key => !fields.includes(key));
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
      console.log("Error while updating job", err);
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
      if (!req.body.jobId || req.body.jobId.length !== 24) {
         return IdValidation(res);
      }

      // Find job with job id
      const job = await models.job.findById(req.body.jobId);
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
      let isJobExist = company.jobs.includes(req.body.jobId);
      if (!isJobExist) {
         return res.status(400).json({
            status: "failed",
            message: "Not authorized roles to access this route"
         });
      }


      await models.job.deleteOne({ _id: job._id });

      // Update job applications
      let jobApplications = await models.jobApplications.find({ jobId: job._id });
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