const User = require("../models/user");
const handleError = require("../utils/handleError");

// Controller for finding user by email
exports.findUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ errors: { email: "Email is required" } });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    handleError(res, err, "Find user error");
  }
};

// Controller for updating user details
exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || !updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "ID and updates are required" });
    }

    // Prevent updating restricted fields
    const disallowedFields = ["_id", "email", "password", "createdAt"];
    Object.keys(updates).forEach((key) => {
      if (disallowedFields.includes(key)) {
        delete updates[key];
      }
    });

    // Only allow specific fields to be updated
    const allowedFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoUrl",
    ];
    Object.keys(updates).forEach((key) => {
      if (!allowedFields.includes(key)) {
        delete updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password"); // don’t send password back

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    handleError(res, err, "Update user error");
  }
};

// Controller for deleting the user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: {
        id: deletedUser._id,
        email: deletedUser.email,
      },
    });
  } catch (err) {
    handleError(res, err, "Delete user error");
  }
};
