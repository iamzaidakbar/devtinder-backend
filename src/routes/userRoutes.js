const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const feedController = require("../controllers/feedController");

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// User routes
router.get("/findUser", userController.findUserByEmail);
router.patch("/updateUser/:id", userController.updateUserById);
router.delete("/deleteUser/:id", userController.deleteUserById);

// Feed route
router.get("/getFeed", feedController.getFeed);

module.exports = router;
