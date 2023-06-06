const express = require('express');
const { SignUp } = require("../Controller/studentController")

const router = express.Router();
router.route('/signup/:role').get(SignUp)

module.exports = router;