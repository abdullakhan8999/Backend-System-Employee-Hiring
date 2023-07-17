const { userStatus } = require("../Constants/rolesConstants");
module.exports = (data) => {
   let status = [...Object.values(userStatus)];
   if (!status.includes(data)) return true;
   return false;
};
