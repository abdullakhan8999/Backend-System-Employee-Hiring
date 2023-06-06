const jwt = require("jsonwebtoken");
const models = require("../Models");
const { ROLES } = require("../Constants/rolesConstants");

module.exports.isAuthenticatedUser = async (req, res, next) => {
   const role = req.params.role;
   const tokenCookieName = role;

   if (ROLES.includes(role)) {
      // finding token that actually belongs to  req.params.role (user)
      const { [tokenCookieName]: token } = req.cookies;

      if (!token) {
         return res.status(401).json({
            "status": "failure",
            "message": "User is not authorized."
         }
         );
      }

      // find user by id
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);


      // providing user in req object
      if (role === "admin") {
         req.user = await models.admin.findById(decoded.id);
      } else if (role === "student") {
         req.user = await models.student.findById(decoded.id);
      } else {
         req.user = await models.company.findById(decoded.id);
      }
      next();
   } else {
      return res.status(401).json({
         status: 'failure',
         message: 'Not authorized to access this route',
      });
   }
}
module.exports.authorizedRoles = () => { }