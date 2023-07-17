const models = {};

models.company = require("./CompanyModel");
models.job = require("./JobsModel");
models.jobApplications = require("./jobApplications");
models.ticket = require("./TicketModel");
models.user = require("./UserModel");

module.exports = models;