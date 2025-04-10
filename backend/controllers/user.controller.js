const { default: mongoose } = require("mongoose");
const Feedback = require("../models/feedback.models");
const File = require("../models/files.models");
const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asynHandler = require("../utils/asyncHandler");
const uploadOnCloudinary = require("../utils/cloudinary");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const refreshAccessToken = asynHandler(async (req, res) => {
  try {
    console.log(req.cookie, req.cookies, req.header.cookie);

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res
        .status(400)
        .json(new ApiError(400, {}, "refresh Token not found"));

    const verifyToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log(verifyToken);

    const user = await User.findById(verifyToken._id);
    const newAccessToken = user.generateAccessToken();

    return res
      .status(200)
      .json(new ApiResponse(200, { newAccessToken, user }, "new accessToken"));
  } catch (error) {
    console.log(error);
  }
});

const registerUser = asynHandler(async (req, res) => {
  const { userName, email, password, isAdmin } = req.body;

  if (!(userName || email || password || isAdmin))
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          { userName, email, password, isAdmin },
          "All details are required"
        )
      );
  // throw new ApiError(400, "All details are required");
  const doesUserExist = await User.findOne({ email: email });

  if (doesUserExist)
    return res
      .status(400)
      .json(new ApiResponse(400, undefined, "User already exists"));
  // return new ApiError(400, "User already exists")

  const profileImageLocalFilePath = req.file?.path;
  if (!profileImageLocalFilePath)
    return res
      .status(404)
      .json(new ApiError(404, undefined, "Profile image not found"));

  const profileImage = await uploadOnCloudinary(profileImageLocalFilePath);

  if (!profileImage)
    return res
      .status(404)
      .json(
        new ApiError(
          404,
          undefined,
          "failed to upload profile image on cloudinary"
        )
      );

  const creatingUser = await User.create({
    userName,
    email,
    password,
    isAdmin,
    profileImage: profileImage?.url,
  });

  const newUser = await User.findById(creatingUser._id).select("-password");
  const { accessToken, refreshToken } = await generateToken(newUser._id);

  const options = {
    httpOnly: true,
    secure: true, // for localhost secure will be false, and for production secure will be true
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { newUser, accessToken },
        "User registered successfully"
      )
    );
});

const logInUser = asynHandler(async (req, res) => {
  const { userName, email, password, isAdmin } = req.body;

  if (!(userName || email || password || isAdmin))
    return res
      .status(400)
      .json(new ApiResponse(400, "All details are required"));
  const findUser = await User.findOne({ userName, email, isAdmin });

  if (!findUser)
    return res
      .status(404)
      .json(new ApiResponse(404, undefined, "User not found"));

  const isPasswordValid = await findUser.isPasswordCorrect(password);
  if (!isPasswordValid)
    return res
      .status(400)
      .json(new ApiResponse(400, undefined, "Password is wrong"));

  const { accessToken, refreshToken } = await generateToken(findUser._id);

  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, {
      ...options,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken },
        "User logged in successfully"
      )
    );
});

const logOutUser = asynHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, undefined, "User logged out successfully"));
});

const getUser = asynHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) return res.status(404).json(new ApiError(404, "User not found"));

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const getAllStudents = asynHandler(async (req, res) => {
  const findUsers = await User.find({ isAdmin: false }).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, findUsers, "Users fetched successfully"));
  // const users = findUsers.select("-password -refreshtoken")
});
const uploadFile = asynHandler(async (req, res) => {
  const { title, description, due_date } = req.body;
  if (!(title && description && due_date))
    // add due_date part here also later on, since it is necessary
    return res
      .status(400)
      .json(new ApiError(400, undefined, "All details are required"));

  const fileLocalPath = req.file?.path;
  if (!fileLocalPath) throw new ApiError(404, "file not found");

  const file = await uploadOnCloudinary(fileLocalPath);
  if (!file)
    return res
      .status(400)
      .json(new ApiError(400, "failed to upload on cloudinary"));

  const uploadedFile = await File.create({
    title,
    description,
    due_date,
    file_url: file?.url,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, uploadedFile, "file uploaded successfully"));
});

// const getAssignments = asynHandler(async (req, res) => {
//   const assignments = await File.find({});

//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, assignments, "assignments fetched successfully")
//     );
// });

const getAssignmentsForStudent = asynHandler(async (req, res) => {
  try {
    const adminsOfStudent = await User.findById(req.user._id).select("admins");
    let assignments = [];
    // console.log(adminsOfStudent);

    for (let admin of adminsOfStudent.admins) {
      // important point
      // first tried with forEach, but forEach does not return promise so await does not work with it;
      // so for....of is used
      let assignmentsOfAdmin = await File.aggregate([
        {
          $match: {
            owner: admin,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "admin",
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
        {
          $addFields: {
            admin: {
              $first: "$admin",
            },
          },
        },
      ]);
      // console.log(assignmentsOfAdmin);
      assignments.push(assignmentsOfAdmin);
      // console.log(assignments);
    }
    // console.log(assignments);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          assignments,
          "Assignments of all admins fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
  }
});

const postFeedback = asynHandler(async (req, res) => {
  const { content, file_id } = req.body;
  const existingFile = await File.findById(file_id);
  if (!existingFile)
    return res
      .status(404)
      .json(new ApiResponse(404, undefined, "assignment was not found"));

  const feedback = await Feedback.create({
    content,
    owner: req.user._id,
    assignment: file_id,
  });

  // start from here
  // adding feedbacks in assignment collection
  const addFeedbackInFile = await File.findByIdAndUpdate(
    file_id,
    {
      $push: { feedbacks: feedback._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, feedback, "feedback posted successfully"));
});

const getFeedbacks = asynHandler(async (req, res) => {
  const { file_id } = req.query;

  const existingFile = await File.findById(file_id);
  if (!existingFile)
    return res
      .status(404)
      .json(new ApiResponse(404, undefined, "assignment was not found"));

  const gettingFeedbackOwner = await File.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(file_id),
      },
    },
    {
      $lookup: {
        from: "feedbacks",
        localField: "feedbacks",
        foreignField: "_id",
        as: "feedbacks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    userName: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
          {
            $project: {
              _id: 1,
              content: 1,
              owner: 1,
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        gettingFeedbackOwner[0].feedbacks,
        "feedbacks fetched successfully"
      )
    );
});

const sendMailToUser = asynHandler(async (req, res) => {
  const { recipients, subject, body } = req.body;
  // console.log(recipients, subject, body);
  let allRecipients = [];
  recipients.map((recipient) => {
    allRecipients.push(recipient.email);
  });
  //console.log(allRecipients,recipients);

  const sentMail = await sendMail(
    // "subhodipnebu52@gmail.com",
    // "Test Email",
    // "Testing email service",
    allRecipients,
    subject,
    body
    // [
    //   {
    //     filename: "FEE Structure.pdf",
    //     path: "public\temp\FEEStructure.pdf",
    //   },
    // ]
  );

  if (!sentMail)
    return res.status(400).json(new ApiError(400, null, "Unable to send mail"));

  return res.status(200).json(new ApiResponse(200, "Mail sent successfully"));
});

module.exports = {
  registerUser,
  refreshAccessToken,
  logInUser,
  logOutUser,
  getUser,
  getAllStudents,
  uploadFile,
  //getAssignments,
  getAssignmentsForStudent,
  postFeedback,
  getFeedbacks,
  sendMailToUser,
};
