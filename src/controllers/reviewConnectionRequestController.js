const ConnectionRequest = require("../models/connectionRequest");
const {
  validateIDs,
  checkOnlyAllowedStatus,
} = require("../utils/connectionRequestUtils");

// Allowed statuses for review
const allowedStatuses = ["accept", "reject"];

// Review Connection Request (accept/reject)
exports.reviewConnectionRequest = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.senderId;
    const status = req.params.status;

    // Validate IDs
    if (!validateIDs(senderId, receiverId, res)) return;
    // Validate status
    if (!checkOnlyAllowedStatus(status, res, allowedStatuses)) return;

    // Check if connection request exists
    const connectionRequest = await ConnectionRequest.findOne({
      senderId,
      receiverId,
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    // If already accepted
    if (connectionRequest.status === "accept") {
      return res
        .status(400)
        .json({ message: "Connection request already accepted." });
    }

    // Accept or reject logic
    if (status === "accept") {
      connectionRequest.status = "accept";
      const data = await connectionRequest.save();
      return res
        .status(200)
        .json({ message: "Connection request accepted.", data });
    }

    if (status === "reject") {
      await ConnectionRequest.deleteOne({ _id: connectionRequest._id });
      return res.status(200).json({ message: "Connection request rejected." });
    }
  } catch (err) {
    console.error("Review request error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
