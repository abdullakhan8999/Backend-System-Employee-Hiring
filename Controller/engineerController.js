const models = require("../Models");
const ApiFeatures = require("../Utils/ApiFeatures");
const { IdValidation, ValidateUpdateEngineerDetails, isStatusExist } = require("../Validator");

//get Engineer details
const getEngineerDetails = async (req, res, next) => {
   try {
      if (req.user.role == "engineer") {
         let engineer = await models.engineer.findById(req.user.id);
         return res.status(200)
            .json({
               status: "success",
               message: "engineer details",
               engineer: engineer
            })
      } else {
         //check for id validation
         if (!req.body.engineer_id || req.body.engineer_id.length !== 24) {
            return IdValidation(res);
         }
         // Access engineerId from request body
         const engineerId = req.body.engineer_id;

         let engineer = await models.engineer.findById(engineerId);
         if (engineer) {
            res.status(200)
               .json({
                  status: "success",
                  message: "engineer details",
                  engineer: engineer
               })
         } else {
            res.status(500).json({
               status: "failed",
               message: `Failed to find engineer with id ${engineerId}`
            })
         }
      }
   } catch (error) {
      res.status(500).json({
         status: "failed",
         message: `Failed to find student with id ${studentId}`
      })
   }
   next();
}

// Get all Engineers details
const getAllEngineer = async (req, res, next) => {
   try {
      let engineers
      // Check if there is not query parameters
      if (Object.keys(req.query).length === 0) {
         engineers = await models.engineer.find().exec();
         return res.status(200).json({
            status: 'success',
            results: engineers.length,
            engineers
         });
      }

      // else return query results
      const apiFeatures = new ApiFeatures(models.engineer.find(), req.query)
         .searchByEngineerStatus()
         .searchByEmail()
      engineers = await apiFeatures.query.exec();

      // send response
      res.status(200).json({
         status: 'success',
         results: engineers.length,
         engineers
      });
   } catch (error) {
      return res.status(400).json({
         status: "failed",
         message: error.message
      })
   }
   next();
}

//Update Engineer status
const UpdateEngineerStatus = async (req, res, next) => {
   //check input to update
   let { error } = await ValidateUpdateEngineerDetails(req.body);
   if (error) {
      return res.status(400).json({
         status: "Failed",
         message: 'Please enter valid details. ' + error
      });
   }

   //check for id validation
   if (req.body.engineer_id.length !== 24) {
      return IdValidation(res);
   }

   //validate status Code 
   const StatusExist = await isStatusExist(req.body.engineerStatus);
   if (StatusExist) {
      return res.status(400).json({
         status: "failed",
         message: "Invalid status code: " + req.body.engineerStatus + ". Please provide a valid status code for the engineer.",
      });
   }

   try {
      // Find engineer
      let engineer = await models.engineer.findById(req.body.engineer_id);
      if (!engineer) {
         return res.status(500).json({
            status: "failed",
            message: `Failed to find engineer with id ${req.body.engineer_id}`
         })
      }

      // Update engineer
      engineer.engineerStatus = req.body.engineerStatus;
      await engineer.save();

      // send response
      res.status(200).json({
         status: "success",
         message: "Engineer status successfully updated.",
      });
   } catch (err) {
      res.status(500).json({
         status: "Failed",
         message: "Failed to update engineer status. Please try again " + err
      });
   }
}

//Delete Engineer 
const deleteEngineer = async (req, res, next) => {
   //check for id validation
   if (!req.body.engineer_id || req.body.engineer_id.length !== 24) {
      return IdValidation(res);
   }

   try {
      //find the engineer
      let engineer = await models.engineer.findById(req.body.engineer_id);
      if (!engineer) {
         return res.status(500).json({
            status: "failed",
            message: `Failed to find engineer with id ${req.body.engineer_id}`
         })
      }

      // Delete engineer
      await models.engineer.deleteOne({ _id: req.body.engineer_id })
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
module.exports = {
   getEngineerDetails,
   getAllEngineer,
   UpdateEngineerStatus,
   deleteEngineer
}