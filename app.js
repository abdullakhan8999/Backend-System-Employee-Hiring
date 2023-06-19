const express = require('express');
const app = express();
const cookiesParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');

//middleware
app.use(express.json());
app.use(cookiesParser());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// router import
app.use("/api/v1", require("./Routers/authRouter"));
app.use("/api/v1", require("./Routers/adminRouter"));
app.use("/api/v1", require("./Routers/jobRouter"));
app.use("/api/v1", require("./Routers/ticketRouter"));




module.exports = app;