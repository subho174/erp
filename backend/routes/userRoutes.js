const express = require("express");
const {
  registerUser,
  logInUser,
  logOutUser,
  uploadFile,
  getAssignments,
  postFeedback,
  getFeedbacks,
} = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const upload = require("../middleware/multer.middleware.js");

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", logInUser);
userRouter.post("/logout", verifyJWT, logOutUser);
userRouter.post("/upload-file", verifyJWT, upload.single("file"), uploadFile);
userRouter.get("/get-assignments", verifyJWT, getAssignments);
userRouter.post("/post-feedback", verifyJWT, postFeedback);
userRouter.get("/get-feedback", verifyJWT, getFeedbacks);

module.exports = userRouter;
