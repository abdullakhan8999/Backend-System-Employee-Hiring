const express = require('express');
const StudentModel = require('./Models/StudentModel');
const admin = require('./Models/AdminModel');
const cam = require('./Models/CompanyModel')
const jobs = require('./Models/JobsModel');
const jobApplications = require('./Models/jobApplications');
const app = express();
const cookiesParser = require("cookie-parser");
const cors = require('cors');

//middleware
app.use(express.json());
app.use(cookiesParser());
app.use(cors());

// router import
app.use("/api/v1", require("./Routers/authRouter"));




module.exports = app;