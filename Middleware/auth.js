const jwt = require("jsonwebtoken");
const models = require("../Models");

module.exports.isAuthenticatedUser = async (req, res, next) => {
   const role = req.params.role;
   const tokenCookieName = role;

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
};

module.exports.authorizedRoles = () => { }