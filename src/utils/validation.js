const validator = require("validator");
const User = require("../models/user");

// Validate sign-in data
const validateSignInData = (data) => {
  const errors = {};
  const { email, password } = data;

  if (!email?.trim()) errors.email = "Email is required";
  if (!password?.trim()) errors.password = "Password is required";

  return errors;
};

// Validate sign-up data
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

// validate edit profile data
const validateEditProfileData = (data) => {
  const errors = {};
  const { firstName, lastName, age, gender, photoUrl } = data;

  // don't allow restricted fields to be updated
  Object.keys(data).forEach((key) => {
    if (["email", "password"].includes(key)) {
      delete data[key];
      errors[key] = `${key} cannot be updated`;
    }
  });

  if (!firstName?.trim()) errors.firstName = "First name is required";
  if (!lastName?.trim()) errors.lastName = "Last name is required";
  if (!age) errors.age = "Age is required";
  if (!gender) errors.gender = "Gender is required";
  if (photoUrl && !validator.isURL(photoUrl))
    errors.photoUrl = "Invalid URL format for photoUrl";

  return errors;
};

// validate change password data
const validateChangePasswordData = async (data) => {
  const { currentPassword, newPassword, confirmNewPassword } = data;
  const errors = {};

  // only allow these fields
  Object.keys(data).forEach((key) => {
    if (
      !["currentPassword", "newPassword", "confirmNewPassword"].includes(key)
    ) {
      delete data[key];
      errors[key] = `${key} cannot be updated`;
    }
  });

  if (!currentPassword) errors.currentPassword = "Current password is required";
  if (!newPassword) errors.newPassword = "New password is required";
  if (!confirmNewPassword)
    errors.confirmNewPassword = "Please confirm new password";

  if (newPassword && newPassword.length < 6)
    errors.newPassword = "New password must be at least 6 characters long";

  if (newPassword !== confirmNewPassword)
    errors.confirmNewPassword = "Passwords do not match";

  if (currentPassword === newPassword) {
    errors.newPassword = "New password must be different from current password";
  }

  return errors;
};

module.exports = {
  validateSignInData,
  validateSignUpData,
  validateEditProfileData,
  validateChangePasswordData,
};
