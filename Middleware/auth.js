const jwt = require("jsonwebtoken");
const models = require("../Models");
const { Roles } = require("../Constants/rolesConstants");

exports.isAuthenticatedUser = async (req, res, next) => {
   const { token } = req.cookies;

   if (token) {
      // find user by id
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);


      // providing user in req object
      if (decoded.role === Roles.COMPANY) {
         req.user = await models.company.findById(decoded.id);
         if (!req.user) {
            return res.status(401).json({
               status: 'failure',
               message: "Please Login to access this resource",
            });
         }
      } else {
         req.user = await models.user.findById(decoded.id);
         if (!req.user) {
            return res.status(401).json({
               status: 'failure',
               message: "Please Login to access this resource",
            });
         }
      }
      next();
   } else {
      return res.status(401).json({
         status: 'failure',
         message: "Please Login to access this resource",
      });
   }
}

exports.authorizedRoles = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return res
            .status(401)
            .json({
               status: "failure",
               message: "Not authorized roles to access this route"
            });
      }
      next();
   };
};

exports.validateTicketRequestBody = (req, res, next) => {
   //Validate title of the ticket
   if (!req.body.title) {
      return res.status(400).send({
         status: "Bad Request",
         message: "Failed! Title is not provided"
      })
   }

   //Validate description of ticket
   if (!req.body.description) {
      return res.status(400).send({
         status: "Bad Request",
         message: "Failed! Description is not provided"
      })
   }

   next();
}