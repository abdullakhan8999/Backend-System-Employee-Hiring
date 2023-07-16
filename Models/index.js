const models = {};

models.student = require("./StudentModel");
models.admin = require("./AdminModel");
models.company = require("./CompanyModel");
models.job = require("./JobsModel");
models.jobApplications = require("./jobApplications");
models.ticket = require("./TicketModel");
models.engineer = require("./EngineerModel");
models.user = require("./UserModel");

module.exports = models;