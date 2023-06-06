const Constants = require('../Constants/rolesConstants');
const models = require('../Models');
const sendToken = require('../Utils/sendToken');
const Validator = require('../Validator');

const SignUp = async (req, res, next) => {
   const role = req.params.role;
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
            status: "failure",
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
            status: "failure",
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
   const { email, password } = req.body;

   //validate email
   req.body.role = role;
   const user = await Validator.isEmailExist(email, "+password");
   if (!user) {
      return res.status(400).json({
         status: "failed",
         message: 'Enter a valid email address.',
      });
   }

   let isPasswordMatch = await user.comparePassword(password);
   if (!isPasswordMatch) {
      return res.status(401).json({
         status: "failure",
         message: `Invalid email or password.`
      })
   }
   sendToken(user, 200, res)
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
      status: "failure",
      message: "Invalid parameters",
   });
};

module.exports = logout;





module.exports = {
   SignUp,
   login,
   logout
};
