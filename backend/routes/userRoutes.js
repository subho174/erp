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
  getAllStudents,
  getAssignmentsForStudent,
  refreshAccessToken,
} = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const upload = require("../middleware/multer.middleware.js");

const userRouter = express.Router();
userRouter.post("/register", upload.single("profileImage"), registerUser);
userRouter.get("/refresh-access-token", refreshAccessToken);
userRouter.post("/login", logInUser);
userRouter.post("/logout", verifyJWT, logOutUser);
userRouter.get("/get-user", verifyJWT, getUser);
userRouter.get("/getAllStudents", verifyJWT, getAllStudents);
userRouter.post("/upload-file", verifyJWT, upload.single("file"), uploadFile);
//userRouter.get("/get-assignments", verifyJWT, getAssignments);
userRouter.patch("/assignment-for-student", verifyJWT, getAssignmentsForStudent);
userRouter.post("/post-feedback", verifyJWT, postFeedback);
userRouter.get("/get-feedback", verifyJWT, getFeedbacks);
userRouter.post("/send-email", verifyJWT, sendMailToUser);

module.exports = userRouter;
