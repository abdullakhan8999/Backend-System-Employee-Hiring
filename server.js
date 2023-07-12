const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./Configs/config.DB');
const AdminModel = require('./Models/AdminModel');


// use dotenv file
dotenv.config({ path: "./Configs/.env" });

//init admin 
const initAdmin = async () => {
   const admin = await AdminModel.findOne({ email: "abdullakhan8999@gmail.com" })

   if (admin) {
      console.log("Admin already exists");
      return
   };
   AdminModel.create({
      firstName: "Patan",
      lastName: "Abdulla Khan",
      email: "abdullakhan8999@gmail.com",
      password: "abdul8999",
   }).then((admin) => {
      // console.log("Admin is created", admin);
      console.log("Admin is created.");
   }).catch((err) => {
      console.log("Error creating admin", err);
   });
}
const init = async () => {
   await connectDB();
   await initAdmin();
   app.listen(8080, () => {
      console.log(`Server is up and running! Access it at http://localhost:${8080}/api/v1`);
   })
}
init();