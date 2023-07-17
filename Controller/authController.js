const models = require('../Models');
const sendToken = require('../Utils/sendToken');
const Validator = require('../Validator');
const { Roles, engineerStatus, userStatus } = require("../Constants/rolesConstants");
const RESPONSES = require('../Constants/RESPONSES');

const SignUp = async (req, res, next) => {

   try {
      // Check for a valid role
      if (req.body.role && !Object.values(Roles).includes(req.body.role)) {
         return res.status(401).json({
            "status": "Failed",
            "message": "Please fill in the role field/ invalid role."
         });
      }

      //email Validation
      if (!req.body.email) {
         return res.status(401).json({
            "status": "Failed",
            "message": "Please fill in the role field/ invalid role."
         });
      }
      let email = req.body.email;

      // is the email already in the user model
      let isEmailExist = await Validator.isEmailExist(email);
      if (isEmailExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The email is already in use by another account.',
         });
      }

      //password validation
      if (req.body.password.length < 8) {
         console.log("Password should be at least 8 characters");
         return res.status(400).json(RESPONSES.VALIDATION_FAILED);
      }

      //if requested user is company 
      if (req.body.role == "company") {

         //request company body validation
         let { error } = await Validator.ValidateSignUp(req.body);
         if (error) {
            console.log(error.details[0].message);
            return res.status(400).json(RESPONSES.VALIDATION_FAILED);
         }

         // Create a new company
         await models.company.create({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            location: req.body.location,
            password: req.body.password
         })
            .then((company) => {
               // console.log("Company created:", company);
               sendToken(company, 201, res);
            })
            .catch((err) => {
               console.log(err);
               return res.status(500).json(RESPONSES.COMPANY.CREATE_FAILED)
            });
      } else {
         //request user body validation
         let { error } = await Validator.ValidateSignUp(req.body);
         if (error) {
            console.log(error.details[0].message);
            return res.status(400).json(RESPONSES.VALIDATION_FAILED);
         }

         //User Object
         let userObject = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
         }
         if (req.body.role) {
            userObject.role = req.body.role;
         }
         // if role other than student then user status pending
         if (req.body.role == "student") {
            userObject.userStatus = userStatus.APPROVED;
         }

         // Create a new user
         await models.user.create(userObject)
            .then((user) => {
               sendToken(user, 201, res);
            })
            .catch((err) => {
               console.log(err);
               return res.status(500).json(RESPONSES.USER.CREATE_FAILED)
            });
      }
   } catch (err) {
      console.log("Error: ", err);
      res.status(500).json(RESPONSES.USER.CREATE_FAILED)
   }
};

const login = async (req, res, next) => {
   try {
      //access email and password
      const { email, password } = req.body;

      // check if email and password are provided
      if (!email || !password) {
         return res.status(400).json(RESPONSES.VALIDATION_FAILED);
      }

      //validate email
      const user = await Validator.isEmailExist(email, "+password");
      if (!user) {
         return res.status(401).json(RESPONSES.USER.INVALID_EMAIL);
      }

      // Check password
      const isPasswordMatched = await user.comparePassword(password);
      if (!isPasswordMatched) {
         return res.status(401).json(RESPONSES.USER.INVALID_PASSWORD);
      }

      // Check user Status
      if (user.userStatus == userStatus.PENDING) {
         return res.status(401).json(RESPONSES.USER.PENDING_STATUS);
      }
      sendToken(user, 200, res);
   } catch (error) {
      res.status(400).json(RESPONSES.ERROR);
   }
}

const logout = async (req, res, next) => {
   try {
      let Option = {
         expires: new Date(Date.now()),
         httpOnly: true
      }
      res.cookie("token", null, Option)
      res.status(200).json(RESPONSES.USER.LOGOUT_SUCCESS)
   } catch (err) {
      console.log("Error while logout :" + err);
      res.status(401).json(RESPONSES.USER.LOGOUT_FAILED);
   }
};

// Update user details
const UpdateUserDetails = async (req, res, next) => {

   if (req.user.role == 'company') {
      try {
         //get company information
         let company = await models.company.findById(req.user.id);

         // filter out valid fields
         let fields = ["companyName", "description", "location", "email"]
         const invalidFields = Object.keys(req.body).filter(key => !fields.includes(key));
         // invalidField has any invalid fields
         if (invalidFields.length > 0) {
            return res.status(400).json({
               status: "failed",
               message: "Invalid fields: " + invalidFields.join(", ")
            });
         }

         //validate email
         const isEmailExist = await Validator.isEmailExist(req.body.email);
         if (isEmailExist) {
            return res.status(400).json({
               status: "failed",
               message: 'The email is already in use by another account.',
            });
         }

         // Update company fields
         company.name = req.body.name || company.name;
         company.description = req.body.description || company.description;
         company.location = req.body.location || company.location;
         company.email = req.body.email || company.email;

         // Save company
         await company.save();

         // sending updated company information
         let response = { ...RESPONSES.COMPANY.UPDATE_SUCCESS, company };
         res.status(200).json(response);
      } catch (err) {
         console.log("Error updating company: " + err);
         res.status(500).json(RESPONSES.COMPANY.UPDATE_FAILED);
      }
   } else {
      try {
         //Updating user details
         let user = await models.user.findById(req.user.id);

         // filter out valid fields
         let fields = ["email", "name"];
         const invalidFields = Object.keys(req.body).filter(key => !fields.includes(key));
         // invalidField has any invalid fields
         if (invalidFields.length > 0) {
            return res.status(400).json({
               status: "failed",
               message: "Invalid fields: " + invalidFields.join(", ")
            });
         }

         //validate email
         const isEmailExist = await Validator.isEmailExist(req.body.email);
         if (isEmailExist) {
            return res.status(400).json({
               status: "failed",
               message: 'The email is already in use by another account.',
            });
         }

         user.name = req.body.name ? req.body.name : user.name
         user.email = req.body.email ? req.body.email : user.email
         await user.save();

         // sending updated results
         let response = { ...RESPONSES.USER.UPDATE_SUCCESS, user }
         res.status(200).json(response);
      } catch (err) {
         console.log("Error while updating user: " + err);
         res.status(500).json(RESPONSES.USER.UPDATE_FAILED);
      };
   }
   next();
};

//Update password Details
const UpdateUserPassword = async (req, res, next) => {

   try {
      //check input to update
      let { error } = await Validator.ValidateUpdateUserPassword(req.body);
      if (error) {
         console.log(error.details[0].message);
         return res.status(400).json(RESPONSES.VALIDATION_FAILED);
      }

      //find the user
      let user;
      if (req.user.role === Roles.COMPANY) {
         user = await models.company.findById(req.user.id).select("+password");
      }
      else {
         user = await models.user.findById(req.user.id).select("+password");
      }

      //check old password and if old password is incorrect
      const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
      if (!isPasswordMatch) {
         return res.status(400).json({
            status: "Failed",
            message: "Old password is incorrect."
         });
      }

      //check new and confirm password are same or not
      if (req.body.confirmPassword != req.body.newPassword) {
         return res.status(400).json({
            status: "Failed",
            message: "Passwords does not match."
         });
      }

      //if yes reset password and save password to  user
      user.password = req.body.newPassword;
      await user.save();

      //send res
      sendToken(user, 200, res);
   } catch (error) {
      console.log("Error while Updating user: " + error);
      res.status(401).json(RESPONSES.USER.UPDATE_FAILED);
   }









};

module.exports = {
   SignUp,
   login,
   logout,
   UpdateUserDetails,
   UpdateUserPassword
};
