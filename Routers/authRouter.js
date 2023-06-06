const express = require('express');
const { isAuthenticatedUser } = require("../Middleware/auth.js");

const { SignUp, login, logout } = require("../Controller/authController")

const router = express.Router();
router.route('/register/:role').post(SignUp);
router.route('/login/:role').post(login)
router.route('/logout/:role').get(isAuthenticatedUser, logout);

module.exports = router;