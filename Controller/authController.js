const Constants = require('../Constants/rolesConstants');
const models = require('../Models');
const sendToken = require('../Utils/sendToken');
const Validator = require('../Validator');
const { ROLES, engineerStatus } = require("../Constants/rolesConstants");

const SignUp = async (req, res, next) => {
   const role = req.params.role;
   const { email, phone } = req.body;

   // Check for a valid role
   if (!ROLES.includes(role) || role === Constants.ADMIN) {
      return res.status(401).json({
         "status": "Failed",
         "message": "Not authorized."
      });
   }

   //validate email
   const isEmailExist = await Validator.isEmailExist(email);
   // console.log("isEmailExist", isEmailExist);
   if (isEmailExist) {
      return res.status(400).json({
         status: "failed",
         message: 'The email is already in use by another account.',
      });
   }

   if (role === Constants.COMPANY) {
      req.body.role = req.params.role;
      let { error } = await Validator.ValidateSignUp(req.body);
      if (error) {
         return res.status(400).json({
            status: "Failed",
            message: 'Please enter valid details.'
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
            console.log(err);
            return res.status(500).json({
               status: "failed",
               message: err
            })
         });


   } else if (role === Constants.ENGINEER) {
      req.body.role = req.params.role;
      let { error } = await Validator.ValidateSignUp(req.body);
      if (error) {
         return res.status(400).json({
            status: "Failed",
            message: 'Please enter valid details. ' + error
         });
      }

      await models.engineer.create({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email,
         password: req.body.password
      })
         .then((engineer) => {
            // console.log("engineer created:", engineer);
            sendToken(engineer, 201, res);
         })
         .catch((err) => {
            return res.status(500).json({
               status: "failed",
               message: `Error while creating user: ${err}`
            })
         });
   } else if (role === Constants.STUDENT) {
      const isPhoneExist = await Validator.isPhoneExist(phone);
      // console.log("isPhoneExist", isPhoneExist);
      if (isPhoneExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The Phone.No is already in use by another account.',
         });
      }


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
   //check for correct user role
   if (user.role != role) {
      return res.status(401).json({
         "status": "Failed",
         "message": "Not authorized."
      });
   }
   if (user.engineerStatus && user.engineerStatus === engineerStatus.pending || user.engineerStatus === engineerStatus.rejected) {
      return res.status(401).json({
         status: "Failed",
         message: "Access denied. The engineer login request has not been approved."
      })
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
         message: "Logout successfully."
      });
      return;
   }
   res.status(500).json({
      status: "Failed",
      message: "Invalid parameters.",
   });
};

// Update user details
const UpdateUserDetails = async (req, res, next) => {

   if (req.user.role == 'student') {
      //validate email
      const isEmailExist = await Validator.isEmailExist(req.body.email);
      if (isEmailExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The email is already in use by another account.',
         });
      }
      const isPhoneExist = await Validator.isPhoneExist(req.body.phone);
      if (isPhoneExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The Phone.No is already in use by another account.',
         });
      }

      try {
         //Updating Student details
         let student = await models.student.findById(req.user.id)
         if (!student) {
            return res.status(400).json({
               status: "Failed",
               message: "Student not found"
            });
         }

         // filter out valid fields
         const invalidFields = Object.keys(req.body).filter(key => !student.schema.path(key));
         // invalidField has any invalid fields
         if (invalidFields.length > 0) {
            return res.status(400).json({
               status: "failed",
               message: "Invalid fields: " + invalidFields.join(", ")
            });
         }

         student.firstName = req.body.firstName ? req.body.firstName : student.firstName
         student.lastName = req.body.lastName ? req.body.lastName : student.lastName
         student.email = req.body.email ? req.body.email : student.email
         student.phone = req.body.phone ? req.body.phone : student.phone
         await student.save();
         res.status(200).json({
            status: "success",
            data: student
         });
      } catch (err) {
         res.status(500).json({
            status: "Failed",
            message: "Failed to update: " + err
         });
      };
   } else if (req.user.role == 'company') {
      //validate email
      const isEmailExist = await Validator.isEmailExist(req.body.email);
      if (isEmailExist) {
         return res.status(400).json({
            status: "failed",
            message: 'The email is already in use by another account.',
         });
      }

      try {
         let company = await models.company.findById(req.user.id);
         if (!company) {
            return res.status(400).json({
               status: "Failed",
               message: "Company not found"
            });
         }

         // filter out valid fields
         const invalidFields = Object.keys(req.body).filter(key => !company.schema.path(key));
         // invalidField has any invalid fields
         if (invalidFields.length > 0) {
            return res.status(400).json({
               status: "failed",
               message: "Invalid fields: " + invalidFields.join(", ")
            });
         }

         // Update company fields
         company.companyName = req.body.companyName || company.companyName;
         company.description = req.body.description || company.description;
         company.location = req.body.location || company.location;
         company.email = req.body.email || company.email;

         // Save company
         await company.save();
         res.status(200).json({
            status: "success",
            data: company
         });
      } catch (err) {
         res.status(500).json({
            status: "Failed",
            message: "Failed to update: " + err
         });
      }

   } else if (req.user.role == 'engineer') {
      try {
         //validate status Code 
         if (req.body.engineerStatus || req.body.role) {
            return res
               .status(401)
               .json({
                  status: "failure",
                  message: "Not authorized roles to access this route"
               });
         }
         let engineer = await models.engineer.findById(req.user.id);
         if (!engineer) {
            return res.status(400).json({
               status: "Failed",
               message: "Engineer not found"
            });
         }

         // filter out valid fields
         const invalidFields = Object.keys(req.body).filter(key => !engineer.schema.path(key));
         // invalidField has any invalid fields
         if (invalidFields.length > 0) {
            return res.status(400).json({
               status: "failed",
               message: "Invalid fields: " + invalidFields.join(", ")
            });
         }

         engineer.firstName = req.body.firstName ? req.body.firstName : engineer.firstName;
         engineer.lastName = req.body.lastName ? req.body.lastName : engineer.lastName;
         engineer.email = req.body.email ? req.body.email : engineer.email;
         await engineer.save();
         res.status(200).json({
            status: "success",
            message: "Engineer status successfully updated.",
            data: engineer
         });
      } catch (err) {
         res.status(500).json({
            status: "Failed",
            message: "Failed to update engineer status. Please try again " + err
         });
      }
   } else {
      return res
         .status(401)
         .json({
            status: "failure",
            message: "Not authorized roles to access this route"
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
   //check for id validation
   if (!UserId || UserId.length !== 24) {
      return IdValidation(res);
   }
   let user;

   // Find user by role and id
   if (req.user.role === "student") {
      user = await models.student.findById(UserId).select("+password");
   } else if (req.user.role === "company") {
      user = await models.company.findById(UserId).select("+password");
   } else if (req.user.role === "engineer") {
      user = await models.engineer.findById(UserId).select("+password");
   } else {
      return res
         .status(401)
         .json({
            status: "failure",
            message: "Not authorized roles to access this route"
         });
   }

   //Check if the user exists or not 
   if (!user) {
      return res.status(400).json({
         status: "Failed",
         message: `${req.user.role === "student" ? "Student" : req.user.role === company ? "Company" : "Engineer"} doesn't exist!`
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
