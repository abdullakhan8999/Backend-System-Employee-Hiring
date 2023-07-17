const RESPONSES = require("../Constants/RESPONSES");
const { Roles } = require("../Constants/rolesConstants");
const models = require("../Models");
const ApiFeatures = require("../Utils/ApiFeatures");
const sendReferenceError = require("../Utils/sendReferenceErrorRES");
const { IdValidation, ValidateUpdateEngineerDetails, isStatusExist, isUserExist } = require("../Validator");

//Update Engineer status
const UpdateEngineerStatus = async (req, res, next) => {
   //check input to update
   let { error } = await ValidateUpdateEngineerDetails(req.body);
   if (error) {
      console.log(error.details[0].message);
      return res.status(400).json(RESPONSES.VALIDATION_FAILED);
   }

   //check for id validation
   if (req.body.engineer_id.length !== 24) {
      console.log("Enter valid Engineer id");
      return IdValidation(res);
   }

   //validate status Code 
   const StatusExist = await isStatusExist(req.body.engineerStatus);
   if (StatusExist) {
      console.log("Invalid engineer status:", req.body.engineerStatus);
      return res.status(400).json({
         status: "failed",
         message: "Invalid status code: " + req.body.engineerStatus + ". Please provide a valid status code for the engineer.",
      });
   }

   try {
      // Find engineer
      let engineer = await models.user.findById(req.body.engineer_id);
      if (!engineer) {
         console.log("Engineer not found");
         return res.status(500).json(RESPONSES.USER.UPDATE_FAILED);
      }

      // Update engineer
      engineer.userStatus = req.body.engineerStatus;
      await engineer.save();

      // send response
      let response = { ...RESPONSES.USER.UPDATE_SUCCESS, engineer }
      res.status(200).json(response);
   } catch (err) {
      res.status(500).json(RESPONSES.USER.UPDATE_FAILED);
   }
}

// Get all Engineers details
const getAllEngineer = async (req, res, next) => {
   try {
      let engineers
      // Check if there is not query parameters
      if (Object.keys(req.query).length === 0) {
         engineers = await models.user.find().exec();
         let results = engineers.length;
         let response = { ...RESPONSES.USER.GET_ALL_SUCCESS, results, engineers }
         return res.status(200).json(response);
      }

      // else return query results
      const apiFeatures = new ApiFeatures(models.user.find(), req.query)
         .searchByUserStatus()
         .searchByEmail()
         .searchByRole()
      engineers = await apiFeatures.query.exec();

      // send response
      let results = engineers.length;
      let response = { ...RESPONSES.USER.GET_ALL_SUCCESS, results, engineers }
      res.status(200).json(response);
   } catch (error) {
      console.log("Error while getting all engineers:", error);
      return res.status(400).json(RESPONSES.USER.GET_ALL_FAILED)
   }
   next();
}

//Delete Engineer 
const deleteEngineer = async (req, res, next) => {
   //check for id validation
   if (!req.body.engineer_id || req.body.engineer_id.length !== 24) {
      return IdValidation(res);
   }

   try {
      //find the engineer
      let engineer = await models.user.findById(req.body.engineer_id);
      if (!engineer) {
         return res.status(500).json({
            status: "failed",
            message: `Failed to find engineer with id ${req.body.engineer_id}`
         })
      }

      // Delete engineer
      await models.user.deleteOne({ _id: req.body.engineer_id })
         .then(() => {
            res.status(200).json({
               status: 'success',
               message: 'Application deleted successfully',
            });
         }).catch((err) => {
            return res.status(500).json({
               status: "failed",
               message: `Failed to delete engineer: ` + err
            })
         });

   } catch (error) {
      res.status(500).json({
         status: "failed",
         message: `Failed to delete engineer: ` + error
      })
   }
}

//get Engineer details
const getEngineerDetails = async (req, res, next) => {
   try {
      if (req.user.role === "admin") {
         //check for id validation
         if (!req.body.engineer_id || req.body.engineer_id.length !== 24) {
            console.log("Invalid engineer id provided.");
            return IdValidation(res);
         }
         // Access engineerId from request body
         const engineerId = req.body.engineer_id;

         let engineer = await models.user.findById(engineerId);
         if (!engineer) {
            console.log("Engineer not found");
            return res.status(500).json(RESPONSES.USER.GET_DETAILS_FAILED)
         }
         let response = { ...RESPONSES.USER.GET_DETAILS_SUCCESS, engineer }
         res.status(200)
            .json(response);
      } else {
         let engineer = await models.user.findById(req.user.id);
         let response = { ...RESPONSES.USER.GET_DETAILS_SUCCESS, engineer }
         return res.status(200)
            .json(response)
      }
   } catch (error) {
      res.status(500).json(RESPONSES.USER.GET_DETAILS_FAILED)
   }
   next();
}

const deleteUser = async (req, res, next) => {


   //check for id validation
   if (!req.body.userId || req.body.userId.length !== 24) {
      return IdValidation(res);
   }

   let userId = req.body.userId;

   let user = await isUserExist(userId);
   if (!user) {
      return res.status(401)
         .json({
            "status": "failed",
            "message": "User does not exist"
         })
   }

   // Check if the user exists and has the same role as refRole
   if (user.role == Roles.ENGINEER && req.user.role == Roles.ENGINEER) {
      return res.status(400)
         .json({
            "status": "failed",
            "message": "Engineer can't delete other engineers"
         })
   }

   // Delete the user
   try {
      if (user.role == Roles.COMPANY) {
         await models.company.deleteOne({ _id: userId })
      } else {
         await models.user.deleteOne({ _id: userId })
      }
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
   deleteUser,
   UpdateEngineerStatus,
   deleteEngineer,
   getAllEngineer,
   getEngineerDetails
}