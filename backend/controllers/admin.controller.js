const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asynHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

const addNewStudent = asynHandler(async (req, res) => {
  const { studentId } = req.body;

  const existingStudents = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
  ]);
  console.log(existingStudents, existingStudents[0].students);

  const doesStudentExist = existingStudents[0].students.some((student) => {
    return studentId == student;
  });

  if (doesStudentExist)
    return res
      .status(400)
      .json(new ApiError(400, null, "Already added as Student"));

  const updatedStudents = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { students: new mongoose.Types.ObjectId(studentId) } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedStudents, "Added students successfully"));
});

const getOwnStudent = asynHandler(async (req, res) => {
  const students = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "students",
        foreignField: "_id",
        as: "students",
        pipeline: [
          {
            $project: {
              userName: 1,
              email: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!students)
    return res
      .status(400)
      .json(new ApiError(400, null, "Can't fetch students data"));

  return res
    .status(200)
    .json(new ApiResponse(200, students, "students fetched successfully"));
});
module.exports = { addNewStudent, getOwnStudent };
