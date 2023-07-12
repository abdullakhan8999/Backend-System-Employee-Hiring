const { ROLES } = require("../Constants/rolesConstants");
const models = require("../Models");
const sendReferenceError = require("../Utils/sendReferenceErrorRES");
const { IdValidation } = require("../Validator");

const getAllStudents = async (req, res, next) => {
   const studentsCount = await models.student.countDocuments();
   await models.student.find()
      .then((students) => {
         res.status(200).json({
            status: "success",
            message: "All students.",
            studentsCount,
            students
         })
      })
      .catch((error) => {
         return res.status(404).json({ status: "failed", message: error.message })
      });
   next();
}

const getAllCompanies = async (req, res, next) => {
   const companiesCount = await models.company.countDocuments();

   await models.company.find()
      .then((companies) => {
         res.status(200).json({
            status: "success",
            message: "All companies.",
            companiesCount,
            companies
         })
      })
      .catch((error) => {
         return res.status(404).json({ status: "failed", message: error.message })
      })
   next();;
}
const getStudentDetails = async (req, res, next) => {

   //check for id validation
   if (!req.body.student_id || req.body.student_id.length !== 24) {
      return IdValidation(res);
   }

   // Access studentId from request body
   const studentId = req.body.student_id;

   // console.log("header", studentId);
   await models.student.findById(studentId)
      .then((student) => {
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
      }).catch((err) => {
         res.status(500).json({
            status: "failed",
            message: `Failed to find student with id ${studentId}`
         })
      });
   next();
}
const getCompanyDetails = async (req, res, next) => {


   //check for id validation
   if (!req.headers.company_id || req.headers.company_id.length !== 24) {
      return IdValidation(res);
   }
   // Access studentId from request headers
   const companyId = req.headers.company_id;

   // console.log("header", studentId);
   let company = await models.company.findById(companyId)
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
            message: `Failed to find company with id ${companyId}`
         })
   }


   next();
}
const deleteUser = async (req, res, next) => {
   let engineerNotAllowed = (res) => {
      return res
         .status(401)
         .json({
            status: "failure",
            message: "Not authorized roles to access this route"
         });
   }
   try {
      // Access userId from request headers
      const refId = req.body.ref_id;
      const refName = req.body.ref_name;

      //check for id validation
      if (!req.body.ref_id || req.body.ref_id.length !== 24) {
         return res.status(400).json({
            status: "failed",
            message: "Invalid ID. Please try again",
         });
      }

      // reference name validation
      if (!ROLES.includes(refName) || refName == "admin") {
         return sendReferenceError(500, res);
      }

      //find user and delete
      let user;
      if (refName == "engineer") {
         //engineer can nont delete other engineers
         if (req.user.role == "engineer") return engineerNotAllowed(res);

         user = await models.engineer.findById(refId);
         if (!user || refName !== user.role) {
            return sendReferenceError(500, res);
         }
         await models.engineer.deleteOne({ _id: refId });
      } else if (refName == "student") {
         user = await models.student.findById(refId);
         if (!user || refName !== user.role) {
            return sendReferenceError(500, res);
         }
         await models.student.deleteOne({ _id: refId });
      } else if (refName === "company") {
         //engineer can not delete company
         if (req.user.role == "engineer") return engineerNotAllowed(res);

         user = await models.company.findById(refId);
         if (!user || refName !== user.role) {
            return sendReferenceError(500, res);
         }
         await models.company.deleteOne({ _id: refId });
      } else if (refName === "job") {
         user = await models.job.findById(refId);
         if (!user || refName !== user.role) {
            return sendReferenceError(500, res);
         }
         await models.job.deleteOne({ _id: refId });
      } else if (refName === "jobApplication") {
         user = await models.jobApplications.findById(refId);
         if (!user || refName !== user.role) {
            return sendReferenceError(500, res);
         }
         await models.jobApplication.deleteOne({ _id: refId });
      } else {
         return res.status(500).json({
            status: "failed",
            message: "Invalid reference name",
         });
      }
      res.status(200).json({
         status: "success",
         message: `Deleted reference name : ${user.role}`,
      });

   } catch (error) {
      console.error(error);
      let errorMessage = "Error while deleting: " + error.message;
      return sendReferenceError(500, res, errorMessage);
   }
};

module.exports = {
   getAllStudents,
   getAllCompanies,
   getStudentDetails,
   getCompanyDetails,
   deleteUser,
}