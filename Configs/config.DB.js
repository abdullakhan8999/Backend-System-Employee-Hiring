const mongoose = require("mongoose");


exports.connectDB = () => {
   mongoose
      .connect("mongodb+srv://abdullakhan8999:nSMBRDq9Wrm8Oft5@crm-db.7raxbfa.mongodb.net/", {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         autoIndex: true,
      })
      .then((data) => {
         console.log(
            `The MongoDB server is now connected, and the host information is: ${data.connection.host}`
         );
      })
      .catch((err) => {
         console.log("Error connecting to MongoDB:", err);
      });
};
