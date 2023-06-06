const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./Configs/Config.db');
const AdminModel = require('./Models/AdminModel');


// use dotenv file
dotenv.config({ path: "./Configs/.env" });

//init admin 
const initAdmin = async () => {
   const admin = await AdminModel.findOne({ email: process.env.admin_email })

   if (admin) {
      console.log("Admin already exists");
      return
   };
   AdminModel.create({
      firstName: process.env.ADMIN_FIRST_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
   }).then((admin) => {
      console.log("Admin is created", admin);
   }).catch((err) => {
      console.log("Error creating admin", err);
   });
}
const init = async () => {
   await connectDB();
   await initAdmin();
   app.listen(process.env.PORT, () => {
      console.log(`Server is up and running! Access it at http://localhost:${process.env.PORT}/api/v1`);
   })
}
init();