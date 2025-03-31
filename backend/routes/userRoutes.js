const express = require("express");
const {
  registerUser,
  logInUser,
  logOutUser,
  uploadFile,
  getAssignments,
  postFeedback,
  getFeedbacks,
  getUser,
  sendMailToUser,
} = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const upload = require("../middleware/multer.middleware.js");

const userRouter = express.Router();
userRouter.post("/register", upload.single("profileImage"), registerUser);
userRouter.post("/login", logInUser);
userRouter.post("/logout", verifyJWT, logOutUser);
userRouter.get("/get-user", verifyJWT, getUser);
userRouter.post("/upload-file", verifyJWT, upload.single("file"), uploadFile);
userRouter.get("/get-assignments", verifyJWT, getAssignments);
userRouter.post("/post-feedback", verifyJWT, postFeedback);
userRouter.get("/get-feedback", verifyJWT, getFeedbacks);
userRouter.post("/send-email", verifyJWT, sendMailToUser);

module.exports = userRouter;
