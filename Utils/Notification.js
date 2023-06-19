let Client = require('node-rest-client').Client;

let client = new Client();

module.exports = (ticketId, subject, content, emailIds, requester) => {
   let reqBody = {
      ticketId,
      subject,
      content,
      recipientEmails: emailIds,
      requester
   };

   let args = {
      data: reqBody,
      headers: { "Content-Type": "application/json" }
   }

   client.post("http://localhost:7777/notificationService/api/v1/notification", args, function (data, response) {
      console.log(data)
   })
}