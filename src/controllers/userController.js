const User = require("../models/user");

// Controller for user signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, email, password } = req.body;

    // Basic validation
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password ||
      !age ||
      !gender?.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      age,
      gender,
      email,
      password,
    });

    // Never return password
    const userSafe = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      email: user.email,
    };

    res.status(201).json({ message: "Signup successful", user: userSafe });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//controller for logging in the user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Never return password
    const userSafe = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };

    res.status(200).json({ message: "Login successful", user: userSafe });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller for find user with email
exports.findUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Find user error:", err);
    res.status(500).json({ message: "Internal server error" });
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
    const disallowedFields = ["_id", "password", "createdAt"];
    Object.keys(updates).forEach((key) => {
      if (disallowedFields.includes(key)) {
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
    console.error("Update user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller for feed
exports.getFeed = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    console.error("Get feed error:", err);
    res.status(500).json({ message: "Internal server error" });
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
    console.log(deletedUser);
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
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
