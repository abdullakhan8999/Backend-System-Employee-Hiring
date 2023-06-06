const models = {};

models.student = require("./StudentModel");
models.admin = require("./AdminModel");
models.company = require("./CompanyModel");

module.exports = models;