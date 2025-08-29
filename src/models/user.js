const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
    select: false, // don’t return password in queries
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
    minlength: 2,
    maxlength: 50,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    minlength: 2,
    maxlength: 50,
    trim: true,
  },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
