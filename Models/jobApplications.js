const mongoose = require('mongoose');


const jobApplicationsSchema = mongoose.Schema({
   student_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'students'
   },
   job_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'jobs'
   },
   title: {
      type: String,
      required: true,
   },
   applicationStatus: {
      type: String,
      default: 'Pending'
   },
   jobAppliedAt: {
      type: Date,
      default: () => { return Date.now(); }
   },
   createdAt: {
      type: Date,
      immutable: true,
      default: () => { return Date.now(); }
   },
   updatedAt: {
      type: Date,
      default: () => { return Date.now(); }
   }
})


module.exports = mongoose.model("jobApplications", jobApplicationsSchema);