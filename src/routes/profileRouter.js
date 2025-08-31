const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const profileController = require("../controllers/profileController");

// Profile routes
router.get("/view", authenticate, profileController.viewProfile);
router.patch("/edit", authenticate, profileController.editProfile);
router.patch("/changePassword", authenticate, profileController.changePassword);

module.exports = router;
