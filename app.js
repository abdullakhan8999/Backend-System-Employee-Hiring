const express = require('express');
const app = express();
const cookiesParser = require("cookie-parser");
const cors = require('cors');

//middleware
app.use(express.json());
app.use(cookiesParser());
app.use(cors());

// router import
app.use("/api/v1", require("./Routers/authRouter"));
app.use("/api/v1", require("./Routers/adminRouter"));
app.use("/api/v1", require("./Routers/jobRouter"));




module.exports = app;