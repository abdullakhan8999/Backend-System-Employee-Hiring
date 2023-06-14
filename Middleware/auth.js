const jwt = require("jsonwebtoken");
const models = require("../Models");
const { ROLES } = require("../Constants/rolesConstants");

exports.isAuthenticatedUser = async (req, res, next) => {
   const role = req.params.role;
   const tokenCookieName = role;

   if (ROLES.includes(role)) {
      // finding token that actually belongs to  req.params.role (user)
      // await console.log("req.cookies", req.cookies);
      // await console.log(tokenCookieName);

      const { [tokenCookieName]: token } = req.cookies;

      if (!token) {
         return res.status(401).json({
            status: 'failure',
            message: 'Not authenticated to access this route',
         });
      }
      // console.log("token", token);

      // find user by id
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded", decoded);


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
      } else {
         req.user = await models.company.findById(decoded.id);
         if (!req.user) {
            return res.status(401).json({
               status: 'failure',
               message: 'Not authenticated to access this route',
            });
         }
      }
      next();
      // console.log(req.user);
   } else {
      return res.status(401).json({
         status: 'failure',
         message: 'Not authenticated to access this route',
      });
   }
}

exports.authorizedRoles = (...roles) => {
   return (req, res, next) => {
      // console.log("roles", roles);
      // console.log("authenticated", req.user);
      if (!roles.includes(req.user.role)) {
         return res
            .status(401)
            .json({
               status: "failure",
               message: "Not authorized to access this route"
            });
      }
      next();
   };
};
