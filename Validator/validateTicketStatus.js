const ticketStatus = require('../Constants/ticketStatus');

module.exports = (status) => {
   const statusType = [
      ticketStatus.open,
      ticketStatus.inProgress,
      ticketStatus.blocked,
      ticketStatus.closed
   ];
   if (status && !statusType.includes(status)) {
      return true;
   }
   return false;
};
