const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');


const companySchema = mongoose.Schema({
   companyName: {
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
      validate: [validator.isEmail, "Please enter a valid email"],
      unique: true
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
      required: true,
      default: "COMPANY",
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

companySchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
   }
   this.password = await bcrypt.hash(this.password, 10);
})
module.exports = mongoose.model("Companies", companySchema);