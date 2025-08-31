const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../config");

const authenticate = async (req, res, next) => {
  let token;

  // Check Authorization header (Bearer token)
  const authHeader = req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // If not in header, check cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token is required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { id } = decoded;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: err.message || "Invalid token." });
  }
};

module.exports = authenticate;
