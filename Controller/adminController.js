const { ROLES } = require("../Constants/rolesConstants");
const models = require("../Models");
const sendReferenceError = require("../Utils/sendReferenceErrorRES");

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
   // Access studentId from request headers
   const studentId = req.headers.student_id;

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
   try {
      // Access userId from request headers
      const refId = req.headers.ref_id;
      const refName = req.headers.ref_name;

      if (ROLES.includes(refName)) {
         let user;

         if (refName === "admin") {
            user = await models.admin.findById(refId);
            if (!user || refName !== user.role) {
               return sendReferenceError(500, res);
            }
            await models.admin.deleteOne({ _id: refId });
         } else if (refName === "student") {
            user = await models.student.findById(refId);
            if (!user || refName !== user.role) {
               return sendReferenceError(500, res);
            }
            await models.student.deleteOne({ _id: refId });
         } else if (refName === "company") {
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
            message: `Deleted reference name : ${user.role != "company" ? user.firstName : user.companyName}`,
         });
      } else {
         return sendReferenceError(500, res);
      }
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
   deleteUser
}