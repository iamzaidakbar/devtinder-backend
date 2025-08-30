const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
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
      lowercase: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      lowercase: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    age: { type: Number, min: 18, max: 60, required: true },
    gender: { type: String, required: true },
    photoUrl: {
      type: String,
      default:
        "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png",
      validate(photoUrl) {
        if (photoUrl && !validator.isURL(photoUrl)) {
          throw new Error("Invalid URL format for photoUrl");
        }
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
