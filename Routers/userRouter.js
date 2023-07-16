const express = require('express');
const userRouter = express.Router();


//Middlewares
const { isAuthenticatedUser, authorizedRoles } = require("../Middleware/auth");


module.exports = userRouter;
