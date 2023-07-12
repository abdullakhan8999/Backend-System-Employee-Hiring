const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./Configs/config.DB');
const AdminModel = require('./Models/AdminModel');


// use dotenv file
dotenv.config({ path: "./Configs/.env" });

//init admin 
const initAdmin = async () => {
   await AdminModel.findOneAndUpdate(
      { email: process.env.admin_email },
      {
         firstName: process.env.ADMIN_FIRST_NAME,
         lastName: process.env.ADMIN_LAST_NAME,
         email: process.env.ADMIN_EMAIL,
         password: process.env.ADMIN_PASSWORD
      },
      { upsert: true, new: true }
   );
   console.log("Admin is created.");
};


const init = async () => {
   await connectDB();
   await initAdmin();
   app.listen(process.env.PORT, () => {
      console.log(`Server is up and running! Access it at http://localhost:${process.env.PORT}/api/v1`);
   })
}
init();