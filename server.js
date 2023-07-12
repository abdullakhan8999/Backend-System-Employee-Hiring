const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./Configs/config.DB');
const AdminModel = require('./Models/AdminModel');
const EngineerModel = require('./Models/EngineerModel');

// Use dotenv file
dotenv.config({ path: "./Configs/.env" });

// Init admin
const initAdmin = async () => {
   const adminEmail = process.env.ADMIN_EMAIL;

   try {
      const existingAdmin = await AdminModel.findOne({ email: adminEmail });

      if (existingAdmin) {
         console.log("Admin already exists.");
         return;
      }

      const newAdmin = new AdminModel({
         firstName: process.env.ADMIN_FIRST_NAME,
         lastName: process.env.ADMIN_LAST_NAME,
         email: adminEmail,
         password: process.env.ADMIN_PASSWORD
      });

      await newAdmin.save();
      console.log("Admin is created.");
   } catch (error) {
      console.error("Error creating admin:", error);
   }
};

// Init admin
const initEngineer = async () => {
   const engineerEmail = process.env.ENGINEER_EMAIL;

   try {
      const existingEngineer = await EngineerModel.findOne({ email: engineerEmail });

      if (existingEngineer) {
         console.log("Engineer already exists.");
         return;
      }

      const newEngineer = new EngineerModel({
         firstName: process.env.ENGINEER_FIRST_NAME,
         lastName: process.env.ENGINEER_LAST_NAME,
         email: engineerEmail,
         engineerStatus: process.env.ENGINEER_STATUS,
         password: process.env.ENGINEER_PASSWORD
      });

      await newEngineer.save();
      console.log("Engineer is created.");
   } catch (error) {
      console.error("Error creating engineer:", error);
   }
};
const init = async () => {
   await connectDB();
   await initAdmin();
   await initEngineer();
   app.listen(process.env.PORT, () => {
      console.log(`Server is up and running! Access it at http://localhost:${process.env.PORT}/api/v1`);
   });
};

init();
