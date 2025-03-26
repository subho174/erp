const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asynHandler = require("../utils/asyncHandler");

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
const registerUser = asynHandler(async (req, res) => {
  const { userName, email, password, isAdmin } = req.body;
  if (!(userName || email || password || isAdmin))
    return res
      .status(400)
      .json(new ApiResponse(400, "All details are required"));
  // throw new ApiError(400, "All details are required");
  const doesUserExist = await User.findOne({ email: email });

  if (doesUserExist)
    return res
      .status(400)
      .json(new ApiResponse(400, undefined, "User already exists"));
  // return new ApiError(400, "User already exists")
  const creatingUser = await User.create({
    userName,
    email,
    password,
    isAdmin,
  });

  const newUser = await User.findById(creatingUser._id).select("-password");
  res
    .status(200)
    .json(new ApiResponse(200, newUser, "User registered successfully"));
});

const logInUser = asynHandler(async (req, res) => {
  const { userName, email, password, isAdmin } = req.body;
  
  if (!(userName, email || password || isAdmin))
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
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logOutUser = asynHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, undefined, "User logged out successfully"));
});
module.exports = { registerUser, logInUser, logOutUser };
