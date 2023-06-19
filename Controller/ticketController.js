const models = require("../Models");
const { validateTicketStatus } = require("../Validator");

// Crete Ticket
const CreteTicket = async (req, res, next) => {
   // ticket object
   const ticketObject = {
      title: req.body.title,
      ticketPriority: req.body.ticketPriority,
      description: req.body.description,
      status: req.body.status,
      reporter: req.user._id, //this is coming from authJwt middleware
      roleReporter: req.user.role //this is coming from authJwt middleware
   }
   // Assign the ticket to the admin
   const admin = await models.admin.findOne({
      role: "admin",
   })
   ticketObject.assignee = admin._id;

   //create a new ticket 
   let ticket = await models.ticket.create(ticketObject);
   // console.log("ticket._id", ticket._id);

   if (req.user.role === "admin") {
      admin.ticketCreated.push(ticket._id);
   } else if (req.user.role === "student") {
      const student = await models.student.findById(req.user._id);
      student.ticketCreated.push(ticket._id);
      await student.save()
   } else if (req.user.role === "company") {
      const company = await models.company.findById(req.user.id);
      company.ticketCreated.push(ticket._id);
      await company.save()
   };

   admin.ticketAssigned.push(ticket._id)
   await admin.save()

   res
      .status(200)
      .json({
         status: 'success',
         data: ticket
      })
}

// Get all tickets
const getAllTicket = async (req, res) => {
   let reporter = req.user.id;
   // validate user
   if (!reporter) {
      return res.status(400)
         .json({
            status: "failed",
            message: "Bad Request!"
         })
   }
   try {
      let tickets = await models.ticket.find({ reporter });
      res.status(200).json({
         status: "success",
         count: tickets.length,
         data: tickets
      })
   } catch (error) {
      return res.status(400).json({
         status: "Failed",
         message: error
      })
   }
}

// Get ticket
const getTicket = async (req, res) => {
   let ticket_id = req.body.ticket_id;
   // validate user
   if (!req.user.id || !ticket_id) {
      return res.status(400)
         .json({
            status: "failed",
            message: "Bad Request!"
         })
   }
   try {
      let ticket = await models.ticket.findById(ticket_id);

      if (ticket && ticket.reporter === req.user.id || req.user.role === "admin") {
         return res
            .status(200)
            .json({
               status: "success",
               ticket
            })
      } else {
         return res
            .status(400)
            .json({
               status: "Failed",
               message: "Bad Request",
            })
      }
   } catch (error) {
      return res.status(400).json({
         status: "Failed",
         message: error
      })
   }
}

// Update Ticket
const UpdateTicket = async (req, res) => {
   let ticket_id = req.body.ticket_id;

   // validate ticket
   if (!ticket_id) {
      return res.status(400)
         .json({
            status: "failed",
            message: "Bad Request!"
         })
   }
   // validate ticket status
   let isError = validateTicketStatus(req.body.status);
   if (isError) {
      return res
         .status(400)
         .json({
            status: "failed",
            message: "Invalid status code!"
         })
   }

   try {
      let ticket = await models.ticket.findById(ticket_id);
      if (!ticket) {
         return res.status(401).json({
            status: "Failed",
            message: "Ticket can only be updated by the customer who created it"
         })
      }

      // admin and user who created ticket can only update the ticket
      if (ticket.reporter == req.user._id || req.user.role == "admin") {
         ticket.title = req.body.title ? req.body.title : ticket.title;
         ticket.description = req.body.description ? req.body.description : ticket.description;
         ticket.ticketPriority = req.body.ticketPriority ? req.body.ticketPriority : ticket.ticketPriority;
         ticket.status = req.body.status ? req.body.status : ticket.status
         await ticket.save()

         res.status(200).json({
            status: "success",
            data: ticket
         })
      } else {
         return res.status(400).json({
            status: "Failed",
            message: "Ticket can only be updated by the customer who created it.",
         })
      }
   } catch (error) {
      return res.status(400).json({
         status: "Failed",
         message: error
      })
   }
}

module.exports = {
   CreteTicket,
   UpdateTicket,
   getAllTicket,
   getTicket
}