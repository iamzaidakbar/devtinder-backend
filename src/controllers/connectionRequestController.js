const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const {
  checkOnlyAllowedStatus,
  validateIDs,
  checkIfUsersExists,
  checkIfSenderIsReceiver,
  checkIfConnectionRequestExists,
  checkIfUsersAreAlreadyConnected,
  checkIfSenderisBlockedByReceiver,
  checkIfSenderBlockedReceiver,
  checkIfReverseConnectionRequestExists,
} = require("../utils/connectionRequestUtils");

// Send Connection Request

exports.connectionRequest = async (req, res) => {
  const senderId = req.params.senderId;
  const receiverId = req.user.id;
  const status = req.params.status;

  if (!validateIDs(senderId, receiverId, res)) return;
  if (!checkOnlyAllowedStatus(status, res, ["interested", "ignore"])) return;
  if (!(await checkIfUsersExists(senderId, receiverId, res, User))) return;
  if (!checkIfSenderIsReceiver(senderId, receiverId, res)) return;
  if (
    !(await checkIfConnectionRequestExists(
      senderId,
      receiverId,
      res,
      ConnectionRequest
    ))
  )
    return;
  if (!(await checkIfUsersAreAlreadyConnected(senderId, receiverId, res, User)))
    return;
  if (
    !(await checkIfSenderisBlockedByReceiver(senderId, receiverId, res, User))
  )
    return;
  if (!(await checkIfSenderBlockedReceiver(senderId, receiverId, res, User)))
    return;
  if (
    !(await checkIfReverseConnectionRequestExists(
      receiverId,
      senderId,
      res,
      ConnectionRequest
    ))
  )
    return;

  await createConnectionRequest(senderId, receiverId, status);
  res.status(201).json({ message: `Connection request sent as '${status}'` });
};

// ...existing code...
const createConnectionRequest = async (senderId, receiverId, status) => {
  const newRequest = new ConnectionRequest({
    senderId,
    receiverId,
    status,
  });
  await newRequest.save();
};
