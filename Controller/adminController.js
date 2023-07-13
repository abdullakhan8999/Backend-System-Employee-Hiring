const { ROLES } = require("../Constants/rolesConstants");
const models = require("../Models");
const ApiFeatures = require("../Utils/ApiFeatures");
const sendReferenceError = require("../Utils/sendReferenceErrorRES");
const { IdValidation } = require("../Validator");

const getAllStudents = async (req, res, next) => {

   let students;
   // Check if there are no query parameters, and return all jobs
   if (Object.keys(req.query).length === 0) {
      students = await models.student.find()
      return res.status(200).json({
         status: 'success',
         message: "All students.",
         results: students.length,
         data: {
            students,
         },
      });
   };

   // Query validation
   let allowedKeys = ["firstName", "email"];
   //query filter
   const filteredQuery = Object.keys(req.query).filter(key =>
      !allowedKeys.includes(key)
   );
   if (filteredQuery.length > 0) {
      return res.status(400).json({
         status: 'failed',
         message: "Invalid search: " + filteredQuery.join(", ")
      });
   }

   // Request query
   const apiFeatures = new ApiFeatures(models.student.find(), req.query)
      .searchByFirstName()
      .searchByEmail()

   // Execute the final query
   students = await apiFeatures.query;

   res.status(200).json({
      status: 'success',
      results: students.length,
      data: {
         students,
      },
   });

   next();
}

const getAllCompanies = async (req, res, next) => {
   let companies;
   // Check if there are no query parameters, and return all jobs
   if (Object.keys(req.query).length === 0) {
      companies = await models.company.find()
      return res.status(200).json({
         status: 'success',
         message: "All companies.",
         results: companies.length,
         data: {
            companies,
         },
      });
   };

   // Query validation
   let allowedKeys = ["companyName", "location"];
   //query filter
   const filteredQuery = Object.keys(req.query).filter(key =>
      !allowedKeys.includes(key)
   );
   if (filteredQuery.length > 0) {
      return res.status(400).json({
         status: 'failed',
         message: "Invalid search: " + filteredQuery.join(", ")
      });
   }

   // Request query
   const apiFeatures = new ApiFeatures(models.company.find(), req.query)
      .searchByCompanyName()
      .searchByLocation()

   // Execute the final query
   companies = await apiFeatures.query;

   res.status(200).json({
      status: 'success',
      results: companies.length,
      data: {
         companies,
      },
   });

   next();
}

const getStudentDetails = async (req, res, next) => {

   try {
      let student;
      if (req.user.role === "student") {
         student = await models.student.findById(req.user.id);
         res
            .status(200)
            .json({
               status: "success",
               message: "Your details",
               student: student
            })
      } else {
         //check for id validation
         if (!req.body.student_id || req.body.student_id.length !== 24) {
            return IdValidation(res);
         }

         // Access studentId from request body
         const studentId = req.body.student_id;

         student = await models.student.findById(studentId);
         if (student) {
            res
               .status(200)
               .json({
                  status: "success",
                  message: "Student details",
                  student: student
               })
         } else {
            res.status(500).json({
               status: "failed",
               message: `Failed to find student with id ${studentId}`
            })
         }
      }
   } catch (error) {
      res.status(500).json({
         status: "failed",
         message: `Failed to find student: ` + error
      })
   }
   next();
}

const getCompanyDetails = async (req, res, next) => {
   let company;
   try {
      if (!req.body.company_id && req.user.role == "company") {
         company = await models.company.findById(req.user.id)
         if (company) {
            res
               .status(200)
               .json({
                  status: "success",
                  message: "Company details",
                  company: company
               })
         } else {
            res
               .status(404).json({
                  status: "failed",
                  message: `Failed to find company with id ${req.user.id}`
               })
         }
      } else {

         //check for id validation
         if (req.body.company_id.length !== 24) {
            return IdValidation(res);
         }

         // Access studentId from request body
         const companyId = req.body.company_id;

         company = await models.company.findById(companyId)
         if (company) {
            res
               .status(200)
               .json({
                  status: "success",
                  message: "company details",
                  company: company
               })
         } else {
            res
               .status(404).json({
                  status: "failed",
                  message: `Failed to find company with id: ${companyId}`
               })
         }
      }
   } catch (error) {
      res
         .status(400).json({
            status: "failed",
            message: `Failed to find company: ${error}`
         })
   }
   next();
}


const deleteUser = async (req, res, next) => {

   // Check if the refRole is valid
   if (!req.body.refRole || !["engineer", "student", "company"].includes(req.body.refRole)) {
      return res.status(500).json({
         status: "failed",
         message: "Invalid reference Role",
      });
   }

   // Assuming the refRole value is provided in the request body
   const refRole = req.body.refRole;

   // Check if an engineer is trying to delete an engineer or a company
   if (req.user.role === "engineer" && ["engineer", "company"].includes(refRole)) {
      return sendReferenceError(500, res, "Not authorized roles to access this route");
   }

   //check for id validation
   if (!req.body.userId || req.body.userId.length !== 24) {
      return IdValidation(res);
   }

   let userId = req.body.userId;
   let user;
   let userModel;

   // Determine the appropriate model based on the refRole
   switch (refRole) {
      case "engineer":
         userModel = models.engineer;
         break;
      case "student":
         userModel = models.student;
         break;
      case "company":
         userModel = models.company;
         break;
      case "job":
         userModel = models.job;
         break;
      case "jobApplication":
         userModel = models.jobApplications;
         break;
   }

   // Find the user by userId and the appropriate model
   user = await userModel.findById(userId);

   // Check if the user exists and has the same role as refRole
   if (!user || refRole !== user.role) {
      return sendReferenceError(500, res, "User does not exist");
   }

   // Delete the user
   try {
      await userModel.deleteOne({ _id: userId })
      res
         .status(200)
         .json({
            status: 'success',
            "message": "User deleted successfully"
         })
   } catch (err) {
      res.status(400)
         .json({
            status: "failed",
            message: "Failed to delete: " + err
         })
   }
};

module.exports = {
   getAllStudents,
   getAllCompanies,
   getStudentDetails,
   getCompanyDetails,
   deleteUser,
}