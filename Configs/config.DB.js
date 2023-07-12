const mongoose = require("mongoose");


exports.connectDB = () => {
   mongoose
      .connect("mongodb://localhost/Backend-System-for-Hiring", {
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
