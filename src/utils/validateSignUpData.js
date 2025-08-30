const validator = require("validator");
const User = require("../models/user");

const validateSignUpData = async (data) => {
  const errors = {};
  const { firstName, lastName, age, gender, email, password, photoUrl } = data;

  if (!firstName?.trim()) errors.firstName = "First name is required";
  if (!lastName?.trim()) errors.lastName = "Last name is required";
  if (!email?.trim()) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (!age) errors.age = "Age is required";
  if (!gender?.trim()) errors.gender = "Gender is required";

  if (password && password.length < 6)
    errors.password = "Password must be at least 6 characters long";

  if (email && !validator.isEmail(email)) errors.email = "Invalid email format";

  if (photoUrl && !validator.isURL(photoUrl))
    errors.photoUrl = "Invalid URL format for photoUrl";

  // Check if user already exists
  if (email && validator.isEmail(email)) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.email = "User already exists";
    }
  }

  return errors;
};

module.exports = validateSignUpData;
