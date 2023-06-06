const express = require('express');
const { SignUp, login } = require("../Controller/authController")

const router = express.Router();
router.route('/register/:role').post(SignUp);
router.route('/login/:role').post(login)

module.exports = router;