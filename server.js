const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./Configs/config.DB');
const UserModel = require('./Models/UserModel');
const rolesConstants = require('./Constants/rolesConstants');

// Use dotenv file
dotenv.config({ path: "./Configs/.env" });

// Init admin
const initAdmin = async () => {
   //get the admin email address
   const adminEmail = process.env.ADMIN_EMAIL;
   try {
      //check if admin is already
      const existingAdmin = await UserModel.findOne({ email: adminEmail });
      if (existingAdmin) {
         console.log("Admin already exists.");
         return;
      }

      // if not, create a new admin
      const newAdmin = new UserModel({
         name: process.env.ADMIN_NAME,
         email: process.env.ADMIN_EMAIL,
         userStatus: process.env.ADMIN_STATUS_APPROVED,
         role: rolesConstants.ADMIN,
         password: process.env.ADMIN_PASSWORD
      });

      // send responds
      await newAdmin.save();
      console.log("Admin is created.");
   } catch (error) {
      console.error("Error creating admin:", error);
   }
};

// Init Engineer
const initEngineer = async () => {
   // Get engineer email address
   const engineerEmail = process.env.ENGINEER_EMAIL;
   try {
      // check if engineer exists
      const existingEngineer = await UserModel.findOne({ email: engineerEmail });
      if (existingEngineer) {
         console.log("Engineer already exists.");
         return;
      }

      // if not, create new engineer
      const newEngineer = new UserModel({
         name: process.env.ENGINEER_NAME,
         email: engineerEmail,
         userStatus: process.env.ENGINEER_STATUS_APPROVED,
         role: rolesConstants.ENGINEER,
         password: process.env.ENGINEER_PASSWORD
      });

      // sending results
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
