const RESPONSES = require("../Constants/RESPONSES");
const models = require("../Models");
const ApiFeatures = require("../Utils/ApiFeatures");
const { IdValidation, } = require("../Validator");


const getAllStudents = async (req, res, next) => {

   let students;
   // Check if there are no query parameters, and return all jobs
   if (Object.keys(req.query).length === 0) {
      students = await models.user.find({ role: "student" });
      return res.status(200).json({
         status: 'success',
         message: "All students.",
         results: students.length,
         students,
      });
   };

   // Query validation
   let allowedKeys = ["name", "email"];
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
   const apiFeatures = new ApiFeatures(models.user.find({ role: "student" }), req.query)
      .searchByName()
      .searchByEmail()

   // Execute the final query
   students = await apiFeatures.query;

   res.status(200).json({
      status: 'success',
      results: students.length,
      students,
   });
   next();
}


const getStudentDetails = async (req, res, next) => {

   try {
      let student;
      if (req.user.role === "student") {
         student = await models.user.findById(req.user.id);
         res
            .status(200)
            .json({
               status: "success",
               message: "Student details",
               student: student
            })
      } else {
         //check for id validation
         if (!req.params.student_id || req.params.student_id.length !== 24) {
            return IdValidation(res);
         }

         // Access studentId from request body
         const studentId = req.params.student_id;

         student = await models.user.findById(studentId);
         if (!student) {
            return res.status(500).json({
               status: "failed",
               message: `Failed to find student with id ${studentId}`
            })
         }
         let response = { ...RESPONSES.USER.GET_DETAILS_SUCCESS, student }
         res.status(200)
            .json(response)
      }
   } catch (error) {
      res.status(500).json({
         status: "failed",
         message: `Failed to find student: ` + error
      })
   }
   next();
}


module.exports = {
   getAllStudents,
   getStudentDetails,
}