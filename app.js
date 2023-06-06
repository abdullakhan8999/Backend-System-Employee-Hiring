const express = require('express');
const StudentModel = require('./Models/StudentModel');
const admin = require('./Models/AdminModel');
const cam = require('./Models/CompanyModel')
const jobs = require('./Models/JobsModel');
const jobApplications = require('./Models/jobApplications');
const app = express();

app.use(express.json());

// router import
app.use("/api/v1", require("./Routers/authRouter"));




module.exports = app;