const User = require("../models/user");
const bcrypt = require("bcrypt");
const handleError = require("../utils/handleError");
const validateSignUpData = require("../utils/validateSignUpData");
const validateSignInData = require("../utils/validateSignInData");

// Signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, age, gender, email, password } = req.body;
    const errors = await validateSignUpData(req.body);
    if (Object.keys(errors).length) {
      if (errors.email === "User already exists") {
        return res.status(409).json({ errors });
      }
      return res.status(400).json({ errors });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      age,
      gender,
      email,
      password: hashedPassword,
    });
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
    handleError(res, err, "Signup error");
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validateSignInData(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({ errors });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ errors: { email: "Invalid email or password" } });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ errors: { password: "Invalid email or password" } });
    }
    const userSafe = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      photoUrl: user.photoUrl,
    };
    res.status(200).json({ message: "Login successful", user: userSafe });
  } catch (err) {
    handleError(res, err, "Login error");
  }
};
