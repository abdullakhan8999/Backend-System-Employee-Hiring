const express = require('express');
const app = express();
const cookiesParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');

//routers 
const routers = require("./Routers");

//middleware
app.use(express.json());
app.use(cookiesParser());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// router import
app.use("/api/v1", require("./Routers/adminRouter"));
app.use("/api/v1", routers.authRouter);
app.use("/api/v1", routers.jobRouter);
app.use("/api/v1", routers.jobApplicationRouter);
app.use("/api/v1", routers.ticketRouter);
app.use("/api/v1", routers.userRouter);
app.use("/api/v1", routers.studentRouter);
app.use("/api/v1", routers.companyRouter);




module.exports = app;