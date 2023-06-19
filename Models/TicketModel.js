const mongoose = require('mongoose');
const { ROLES } = require('../Constants/rolesConstants')
const ticketSchema = mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   ticketPriority: {
      type: Number,
      required: true,
      default: 4
   },
   description: {
      type: String,
      required: true
   },
   status: {
      type: String,
      required: true,
      default: "OPEN"
   },
   reporter: {
      type: String
   },
   roleReporter: {
      type: String,
      default: ROLES[1]
   },
   assignee: {
      type: String
   },
   createdAt: {
      type: Date,
      immutable: true,
      default: () => {
         return Date.now()
      }
   },
   updatedAt: {
      type: Date,
      default: () => {
         return Date.now()
      }
   }
})



module.exports = mongoose.model("ticket", ticketSchema);