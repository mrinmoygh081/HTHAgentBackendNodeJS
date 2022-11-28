const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const Driver = require("./driverModel");
const CarOwner = require("./ownerModel");
const CarDocument = require("./carDocumentModel");
const User = require("./userModel");

const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  businessName: {
    type: String,
    required: [true, "please enter your business name"],
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
    required: [true, "Please enter phone number"],
  },
  created_at: {
    type: Date,
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
  },
  designation: {
    type: String,
    required: [true, "Please enter your designation"],
  },
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
});

RegisterSchema.set("toObject", { virtuals: true });
RegisterSchema.set("toJSON", { virtuals: true });

const Register = mongoose.model("Register", RegisterSchema);
module.exports = Register;
