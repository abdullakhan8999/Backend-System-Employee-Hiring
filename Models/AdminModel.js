const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');


const adminSchema = mongoose.Schema({
   firstName: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
   },
   lastName: {
      type: String,
      required: true,
      minLength: [4, "Name should be more than 4 characters"],
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
      default: "admin",
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

adminSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
   }
   this.password = await bcrypt.hash(this.password, 10);
})
module.exports = mongoose.model("admin", adminSchema);