const express = require("express");
const {
  registerUser,
  logInUser,
  logOutUser,
  uploadFile,
  getAssignments,
} = require("../controllers/user.controller.js");
const verifyJWT = require("../middleware/auth.middleware.js");
const upload = require("../middleware/multer.middleware.js");

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", logInUser);
userRouter.post("/logout", verifyJWT, logOutUser);
userRouter.post("/upload-file", verifyJWT, upload.single("file"), uploadFile);
userRouter.get("/get-assignments", verifyJWT, getAssignments)

module.exports = userRouter;
