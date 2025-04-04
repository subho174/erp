const express = require("express");
const {
  addNewStudent,
  getOwnStudent,
} = require("../controllers/admin.controller");
const verifyJWT = require("../middleware/auth.middleware");

const adminRouter = express.Router();
adminRouter.post("/add-student", verifyJWT, addNewStudent);
adminRouter.get("/get-student", verifyJWT, getOwnStudent);
module.exports = adminRouter;
