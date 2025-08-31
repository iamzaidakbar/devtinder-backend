const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");
const authenticate = require("../middlewares/authenticate");

// Feed route
router.get("/getFeed", authenticate, feedController.getFeed);

module.exports = router;
