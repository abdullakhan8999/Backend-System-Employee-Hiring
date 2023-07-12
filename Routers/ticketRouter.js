const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles, validateTicketRequestBody } = require("../Middleware/auth");
const { CreteTicket, UpdateTicket, getAllTicket, getTicket } = require("../Controller/ticketController.js");
const { Roles } = require('../Constants/rolesConstants');

// create Ticket
router
   .route('/create/tickets/:role')
   .post(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      validateTicketRequestBody,
      CreteTicket
   )

// get all Tickets
router
   .route('/get_all/ticket/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getAllTicket
   )

// get a Ticket
router
   .route('/get/ticket/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      getTicket
   )

// update Ticket
router
   .route('/update/ticket/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(...Object.values(Roles)),
      UpdateTicket
   )

module.exports = router;