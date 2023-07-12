const jwt = require("jsonwebtoken");
const models = require("../Models");
const { ROLES } = require("../Constants/rolesConstants");

exports.isAuthenticatedUser = async (req, res, next) => {
   const role = req.params.role;
   const tokenCookieName = role;

   if (ROLES.includes(role)) {

      const { [tokenCookieName]: token } = req.cookies;

      if (!token) {
         return res.status(401).json({
            status: 'failure',
            message: 'Not authenticated to access this route',
         });
      }

      // find user by id
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);


      // providing user in req object
      if (decoded.role === "admin") {
         req.user = await models.admin.findById(decoded.id);
         if (!req.user) {
            return res.status(401).json({
               status: 'failure',
               message: 'Not authenticated to access this route',
            });
         }
      } else if (decoded.role === "student") {
         req.user = await models.student.findById(decoded.id);
         if (!req.user) {
            return res.status(401).json({
               status: 'failure',
               message: 'Not authenticated to access this route',
            });
         }
      } else if (decoded.role === "company") {
         req.user = await models.company.findById(decoded.id);
         if (!req.user) {
            return res.status(401).json({
               status: 'failure',
               message: 'Not authenticated to access this route',
            });
         }
      } else {
         req.user = await models.engineer.findById(decoded.id);
         if (!req.user) {
            return res.status(401).json({
               status: 'failure',
               message: 'Not authenticated to access this route',
            });
         }
      }
      next();
   } else {
      return res.status(401).json({
         status: 'failure',
         message: 'Not authenticated to access this route',
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