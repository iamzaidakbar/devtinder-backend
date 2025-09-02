const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const connectionRequestController = require("../controllers/connectionRequestController");
const reviewConnectionRequestController = require("../controllers/reviewConnectionRequestController");

router.post(
  "/:status/:senderId",
  authenticate,
  connectionRequestController.connectionRequest
);

router.post(
  "/review/:status/:senderId",
  authenticate,
  reviewConnectionRequestController.reviewConnectionRequest
);

module.exports = router;
