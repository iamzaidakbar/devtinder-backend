const bcrypt = require("bcrypt");
const handleError = require("../utils/handleError");
const User = require("../models/user");
const {
  validateEditProfileData,
  validateChangePasswordData,
} = require("../utils/validation");

// Controller for finding user by email
exports.viewProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    handleError(res, err, "Find user error");
  }
};

// Controller for editing user profile
exports.editProfile = async (req, res) => {
  try {
    const errors = validateEditProfileData(req.body);

    if (Object.keys(errors).length) {
      if (errors.email === "User already exists") {
        return res.status(409).json({ errors });
      }
      return res.status(400).json({ errors });
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        loggedInUser[key] = req.body[key];
      }
    });
    await loggedInUser.save();
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: loggedInUser });
  } catch (err) {
    handleError(res, err, "Edit profile error");
  }
};

// controller for changing the user password
exports.changePassword = async (req, res) => {
  try {
    const errors = await validateChangePasswordData(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }

    // compare old password
    const userId = req.user.id;
    const loggedInUser = await User.findById(userId).select("+password");
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await loggedInUser.comparePassword(req.body.currentPassword);
    if (!match) {
      return res
        .status(401)
        .json({ errors: { oldPassword: "Old password is incorrect" } });
    }

    // hash new password and save
    loggedInUser.password = await bcrypt.hash(req.body.newPassword, 5);
    await loggedInUser.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    handleError(res, err, "Change password error");
  }
};
