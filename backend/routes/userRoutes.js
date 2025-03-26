const express = require("express");
const {registerUser, logInUser, logOutUser} = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", logInUser);
userRouter.post("/logout", verifyJWT, logOutUser);

module.exports = userRouter;
