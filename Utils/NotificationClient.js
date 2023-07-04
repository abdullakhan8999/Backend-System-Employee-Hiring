let Client = require("node-rest-client").Client;

let client = new Client();

module.exports = (ticketId, subject, content, emailIds, requester) => {
   // request body
   let reqBody = {
      ticketId,
      subject,
      content,
      requester,
      recipientEmails: emailIds,
   }

   //setting headers
   let args = {
      data: reqBody,
      headers: {
         "Content-Type": "application/json"
      }
   }

   // url 
   let url = "http://localhost:8082/api/v1/notification";

   // send request
   client.post(url, args, (data, response) => {
      console.log("data", data);
   });
} 