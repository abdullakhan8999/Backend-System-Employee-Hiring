const models = require("../Models");
const {
   ValidateJob,
   ValidateDeleteJobById,
   IdValidation
} = require("../Validator");
const ApiFeatures = require("../Utils/ApiFeatures");
const { JOB_STATUSES, JOB_APPLICATION_STATUSES } = require("../Constants/jobApplicationConstants");

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
   if (!Object.values(JOB_STATUSES).includes(hiring_status)) {
      return res.status(404).json({
         status: "failed",
         message: "Enter valid hiring status: " + hiring_status,
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
      salary,
      vacancies,
      hiring_status
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
      if (Object.keys(req.query).length === 0) {
         let jobs = models.job.find()
         return res.status(200).json({
            status: 'success',
            results: jobs.length,
            data: {
               jobs,
            },
         });
      };

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
   //check for id validation
   if (!req.body.job_id || req.body.job_id.length !== 24) {
      return IdValidation(res);
   }

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
   //check for id validation
   if (!req.body.job_id || req.body.job_id.length !== 24) {
      return IdValidation(res)
   }

   //  Update job details
   let job = await models.job.findById(req.body.job_id)
   try {
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
   //validation
   let { error } = await ValidateDeleteJobById(req.body);
   if (error) {
      return res.status(400).json({
         status: "failure",
         message: 'Please enter valid details. ' + error
      });
   }

   // Find job with job id
   const job = await models.job.findById(req.body.job_id);
   if (!job) {
      // Job not found
      return res.status(404).json({
         status: "failed",
         message: "Job not found.",
      });
   }

   // Delete job
   try {
      await models.job.deleteOne({ _id: job._id });

      // Update job applications
      let jobApplications = await models.jobApplications.find({ job_id: job._id });
      console.log(jobApplications);
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