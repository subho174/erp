const express = require("express");
const {registerUser, logInUser, logOutUser} = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");

const userRouter = express.Router();
userRouter.get("/register", registerUser);
userRouter.post("/login", logInUser);
userRouter.post("/logout", verifyJWT, logOutUser);

module.exports = userRouter;
