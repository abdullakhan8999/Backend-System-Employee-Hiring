const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizedRoles, validateTicketRequestBody } = require("../Middleware/auth");
const { CreteTicket, UpdateTicket, getAllTicket, getTicket } = require("../Controller/ticketController.js");
const { ROLES } = require('../Constants/rolesConstants');

// create Ticket
router
   .route('/create/tickets/:role')
   .post(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      validateTicketRequestBody,
      CreteTicket
   )

// update Ticket
router
   .route('/update/ticket/:role')
   .put(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      UpdateTicket
   )

// get all Tickets
router
   .route('/get_all/ticket/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      getAllTicket
   )

// get a Ticket
router
   .route('/get/ticket/:role')
   .get(
      isAuthenticatedUser,
      authorizedRoles(...ROLES.map(role => role)),
      getTicket
   )


module.exports = router;