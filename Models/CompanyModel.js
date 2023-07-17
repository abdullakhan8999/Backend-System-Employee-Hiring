const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');
const Constants = require('../Constants/rolesConstants');
const jwt = require('jsonwebtoken');


const companySchema = mongoose.Schema({
   name: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
   },
   description: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
   },
   location: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
      default: "",
   },
   email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
   },
   password: {
      type: String,
      required: true,
      minLength: [8, "Password should be more than 8 characters"],
      maxLength: [30, "Password should be less than 30 characters"],
      select: false,
   },
   role: {
      type: String,
      default: Constants.COMPANY,
   },
   jobs: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'jobs'
      }
   ],
   jobApplications: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'jobApplications'
      }
   ],
   ticketCreated: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "ticket"
   },
   ticketAssigned: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "ticket"
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

//hashing password
companySchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
   }
   this.password = await bcrypt.hash(this.password, 10);
})

//comparing password
companySchema.methods.comparePassword = async function (enterPassword) {
   return await bcrypt.compare(enterPassword, this.password);
}

// get token method
companySchema.methods.getJwtToken = function () {
   return jwt.sign(
      {
         id: this._id, role: this.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
   );
};


// Generate reset password token
companySchema.methods.getResetPasswordToken = async function () {

   // Generate reset password token
   const resetToken = await crypto.randomBytes(20).toString("hex");

   //  reset Password Token
   this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

   this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

   return resetToken
};

module.exports = mongoose.model("Companies", companySchema);