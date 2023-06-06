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
   applicationStatus: {
      type: String,
      required: true,
      default: 'pending'
   },
   applications: {
      type: Date,
      required: true,
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