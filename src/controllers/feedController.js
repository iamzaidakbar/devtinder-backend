const User = require("../models/user");
const handleError = require("../utils/handleError");

// Get user feed
exports.getFeed = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    handleError(res, err, "Get feed error");
  }
};
