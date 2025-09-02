const mongoose = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest");

function sendError(res, status, error) {
  res.status(status).json({ error });
}

function checkOnlyAllowedStatus(status, res, allowedStatuses) {
  if (!status || !allowedStatuses.includes(status)) {
    sendError(
      res,
      400,
      `Invalid status. Allowed statuses are: ${allowedStatuses.join(", ")}`
    );
    return false;
  }
  return true;
}

function validateIDs(senderId, receiverId, res) {
  if (!senderId || !receiverId) {
    sendError(res, 400, "Sender ID and Receiver ID are required");
    return false;
  } else if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
    sendError(res, 400, "Invalid Sender ID or Receiver ID");
    return false;
  }
  return true;
}

async function checkIfUsersExists(senderId, receiverId, res, User) {
  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);
  if (!sender || !receiver) {
    sendError(res, 404, "Sender or Receiver not found");
    return false;
  }
  return true;
}

function checkIfSenderIsReceiver(senderId, receiverId, res) {
  if (senderId === receiverId) {
    sendError(res, 400, "Sender and Receiver cannot be the same user");
    return false;
  }
  return true;
}

async function checkIfConnectionRequestExists(
  senderId,
  receiverId,
  res,
  ConnectionRequest
) {
  const existingRequest = await ConnectionRequest.findOne({
    senderId,
    receiverId,
    status: { $in: ["interested", "ignore"] },
  });
  if (existingRequest) {
    sendError(res, 409, "Connection request already exists");
    return false;
  }
  return true;
}

async function checkIfUsersAreAlreadyConnected(
  senderId,
  receiverId,
  res,
  User
) {
  const sender = await User.findById(senderId);
  if (sender.connections?.includes(receiverId)) {
    sendError(res, 409, "Users are already connected");
    return false;
  }
  return true;
}

async function checkIfSenderisBlockedByReceiver(
  senderId,
  receiverId,
  res,
  User
) {
  const receiver = await User.findById(receiverId);
  if (receiver.blockedUsers?.includes(senderId)) {
    sendError(res, 403, "You are blocked by this user");
    return false;
  }
  return true;
}

async function checkIfSenderBlockedReceiver(senderId, receiverId, res, User) {
  const sender = await User.findById(senderId);
  if (sender.blockedUsers?.includes(receiverId)) {
    sendError(res, 403, "You have blocked this user");
    return false;
  }
  return true;
}

async function checkIfReverseConnectionRequestExists(
  receiverId,
  senderId,
  res,
  ConnectionRequest
) {
  const reverseRequest = await ConnectionRequest.findOne({
    senderId: receiverId,
    receiverId: senderId,
    status: { $in: ["interested", "ignore"] },
  });
  if (reverseRequest) {
    sendError(res, 409, "This user has already sent you a connection request");
    return false;
  }
  return true;
}

const ifAlreadyAccepted = async (senderId, receiverId, res) => {
  const existingRequest = await ConnectionRequest.findOne({
    senderId,
    receiverId,
    status: "accept", // ✅ only check accepted requests
  });

  if (existingRequest) {
    sendError(res, 400, "Connection request already accepted.");
    return true;
  }
  return false;
};

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  sendError,
  checkOnlyAllowedStatus,
  validateIDs,
  checkIfUsersExists,
  checkIfSenderIsReceiver,
  checkIfConnectionRequestExists,
  checkIfUsersAreAlreadyConnected,
  checkIfSenderisBlockedByReceiver,
  checkIfSenderBlockedReceiver,
  checkIfReverseConnectionRequestExists,
  isValidObjectId,
  ifAlreadyAccepted,
};
