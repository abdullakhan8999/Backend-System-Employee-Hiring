const Constants = require('../Constants/rolesConstants');
const models = require('../Models');
const sendToken = require('../Utils/sendToken');
const Validator = require('../Validator');
const { ROLES } = require("../Constants/rolesConstants");

const SignUp = async (req, res, next) => {
   const role = req.params.role;
   if (!ROLES.includes(role)) {
      return res.status(401).json({
         "status": "Failed",
         "message": "Not authorized."
      });
   }
   //not allowed to create admin
   if (role === Constants.ADMIN) return res.status(400).json({ message: 'Invalid role' });

   const { email, phone } = req.body;

   //validate email
   const isEmailExist = await Validator.isEmailExist(email);
   // console.log("isEmailExist", isEmailExist);
   if (isEmailExist) {
      return res.status(400).json({
         status: "failed",
         message: 'The email is already in use by another account.',
      });
   }
   if (role === Constants.STUDENT) {
      const isPhoneExist = await Validator.isPhoneExist(phone);
      // console.log("isPhoneExist", isPhoneExist);
      if (isPhoneExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The Phone.No is already in use by another account.',
         });
      }
   }

   if (role === Constants.COMPANY) {
      req.body.role = req.params.role;
      let { error } = await Validator.ValidateSignUp(req.body);
      if (error) {
         return res.status(400).json({
            status: "Failed",
            message: 'Please enter valid details.' + error
         });
      }

      await models.company.create({
         companyName: req.body.companyName,
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
            return res.status(500).json({
               status: "failed",
               message: err
            })
         });


   } else if (role === Constants.STUDENT) {
      req.body.role = req.params.role;
      let { error } = await Validator.ValidateSignUp(req.body);

      if (error) {
         return res.status(400).json({
            status: "Failed",
            message: 'Please enter valid details. ' + error
         });
      }
      await models.student.create({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email,
         phone: req.body.phone,
         password: req.body.password
      })
         .then((student) => {
            // console.log("student created:", student);
            sendToken(student, 201, res);
         })
         .catch((err) => {
            return res.status(500).json({
               status: "failed",
               message: err
            })
         });
   } else {
      return res.status(400).json({ message: 'Invalid role' });
   }
};

const login = async (req, res, next) => {
   const role = req.params.role;
   if (!ROLES.includes(role)) {
      return res.status(401).json({
         "status": "Failed",
         "message": "Not authorized."
      });
   }
   const { email, password } = req.body;


   //validate email
   const user = await Validator.isEmailExist(email, "+password");
   if (!user) {
      return res.status(400).json({
         status: "failed",
         message: 'Enter a valid email address.',
      });
   }
   if (user.role != role) {
      return res.status(401).json({
         "status": "Failed",
         "message": "Not authorized."
      });
   }
   try {
      let isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
         return res.status(401).json({
            status: "Failed",
            message: `Invalid email or password.`
         })
      }
      sendToken(user, 200, res)
   } catch (error) {
      console.log(error);
   }

}

const logout = async (req, res, next) => {
   if (req.user) {
      const cookieName = req.user.role; // Unique cookie name based on user role
      res.clearCookie(cookieName, {
         expires: new Date(Date.now()),
         httpOnly: true,
      });
      res.status(200).json({
         status: "success",
         data: {},
      });
      return;
   }
   res.status(500).json({
      status: "Failed",
      message: "Invalid parameters",
   });
};

// Update user details
const UpdateUserDetails = async (req, res, next) => {

   const isUserExist = await Validator.isUserExist(req.body.id);
   if (!isUserExist) {
      return res.status(400).json({
         status: "failed",
         message: 'User dose not exits.',
      });
   }

   if (req.user.role == 'student') {
      //check input to update
      let { error } = await Validator.ValidateUpdateStudentDetails(req.body);
      if (error) {
         return res.status(400).json({
            status: "Failed",
            message: 'Please enter valid details. ' + error
         });
      }
      // Student details
      const updateDetails = {
         id: req.body.id,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email,
         phone: req.body.phone,
      };

      //validate email
      const isEmailExist = await Validator.isEmailExist(req.body.email);
      // console.log("isEmailExist", isEmailExist);
      if (isEmailExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The email is already in use by another account.',
         });
      }
      if (req.user.role === Constants.STUDENT) {
         const isPhoneExist = await Validator.isPhoneExist(req.body.phone);
         // console.log("isPhoneExist", isPhoneExist);
         if (isPhoneExist) {
            return res.status(400).json({
               status: "failed",
               message: 'The Phone.No is already in use by another account.',
            });
         }
      }

      //Updating Student details
      await models.student.findByIdAndUpdate(req.user.id, updateDetails, {
         new: true,
         runValidators: true,
         useFindAndModify: false,
      }).then((student) => {
         //send res
         res.status(200).json({
            status: "success",
            data: student
         });
      }).catch((err) => {
         res.status(500).json({
            status: "Failed",
            message: "Failed to update: " + err
         });
      });
   } else if (req.user.role == 'company') {
      //check input to update
      let { error } = await Validator.ValidateUpdateCompanyDetails(req.body);
      if (error) {
         return res.status(400).json({
            status: "Failed",
            message: 'Please enter valid details. ' + error
         });
      }
      // company details
      const updateDetails = {
         companyName: req.body.companyName,
         description: req.body.description,
         location: req.body.location,
         email: req.body.email,
      };

      //validate email
      const isEmailExist = await Validator.isEmailExist(req.body.email);
      // console.log("isEmailExist", isEmailExist);
      if (isEmailExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The email is already in use by another account.',
         });
      }

      //Updating Student details
      await models.company.findByIdAndUpdate(req.user.id, updateDetails, {
         new: true,
         runValidators: true,
         useFindAndModify: false,
      }).then((company) => {
         //send res
         res.status(200).json({
            status: "success",
            data: company
         });
      }).catch((err) => {
         res.status(500).json({
            status: "Failed",
            message: "Failed to update: " + err
         });
      });
   }
   next();
};

//Update password Details
const UpdateUserPassword = async (req, res, next) => {
   //check input to update
   let { error } = await Validator.ValidateUpdateUserPassword(req.body);
   if (error) {
      return res.status(400).json({
         status: "Failed",
         message: 'Please enter valid details. ' + error
      });
   }

   //when user login user id is fetched to req so using auth
   const UserId = req.user.id;
   let user;

   if (req.user.role === "student") {
      user = await
         models
            .student
            .findById(UserId).select("+password");
   } else {
      user = await
         models
            .company
            .findById(UserId).select("+password");
   }


   if (!user) {
      return res.status(400).json({
         status: "Failed",
         message: `${req.user.role === "student" ? "Student" : "Company"} doesn't exist!`
      });
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
};

module.exports = {
   SignUp,
   login,
   logout,
   UpdateUserDetails,
   UpdateUserPassword
};
