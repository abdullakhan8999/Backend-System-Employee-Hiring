const express = require('express');
const ticketRouter = express.Router();
const { isAuthenticatedUser, authorizedRoles, validateTicketRequestBody } = require("../Middleware/auth");
const { CreteTicket, UpdateTicket, getAllTicket, getTicket } = require("../Controller/ticketController.js");
const { Roles } = require('../Constants/rolesConstants');

// create Ticket
ticketRouter
   .route('/create/tickets/:role')
   .post(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      validateTicketRequestBody,
      CreteTicket
   )

// get all Tickets
ticketRouter
   .route('/get_all/ticket/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllTicket
   )

// get a Ticket
ticketRouter
   .route('/get/ticket/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getTicket
   )

// update Ticket
ticketRouter
   .route('/update/ticket/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      UpdateTicket
   )

module.exports = ticketRouter;