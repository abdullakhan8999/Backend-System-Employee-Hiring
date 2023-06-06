const mongoose = require('mongoose');


const jobSchema = mongoose.Schema({
   title: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
   },
   description: {
      type: String,
      required: true,
   },
   company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'company'
   },
   location: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
      default: "",
   },
   requirement: {
      type: [String],
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
      default: "",
   },
   salary: {
      type: String,
      required: true
   },
   startDate: {
      type: Date,
      required: true
   },
   endDate: {
      type: Date,
      required: true
   },
   applications: {
      type: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "jobApplications"
         }
      ]
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


module.exports = mongoose.model("job", jobSchema);