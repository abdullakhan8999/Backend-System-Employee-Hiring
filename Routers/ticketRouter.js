const express = require('express');
const ticketRouter = express.Router();
const { isAuthenticatedUser, authorizedRoles, validateTicketRequestBody } = require("../Middleware/auth");
const { CreteTicket, UpdateTicket, getAllTicket, getTicket } = require("../Controller/ticketController.js");
const { Roles } = require('../Constants/rolesConstants');

// create Ticket
ticketRouter
   .route('/create/tickets')
   .post(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      validateTicketRequestBody,
      CreteTicket
   )

// get all Tickets
ticketRouter
   .route('/get_all/ticket')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllTicket
   )

// get a Ticket
ticketRouter
   .route('/get/ticket')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getTicket
   )

// update Ticket
ticketRouter
   .route('/update/ticket')
   .put(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      UpdateTicket
   )

module.exports = ticketRouter;