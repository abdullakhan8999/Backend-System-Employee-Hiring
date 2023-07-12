const { engineerStatus } = require("../Constants/rolesConstants");
module.exports = (data) => {
   let status = [...Object.values(engineerStatus)];
   if (!status.includes(data)) return true;
   return false;
};
