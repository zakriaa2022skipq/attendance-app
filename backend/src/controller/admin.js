const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { hashPassword, verifyPassword } = require("../util/password");

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, username } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    req.statusCode = 400;
    throw new Error("User with this username already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    username,
    isAdmin: true,
  });
  return res.status(201).json({ msg: "admin user registered successfully" });
});
const loginAdmin = asyncHandler(async (req, res) => {
  const { password, username } = req.body;
  const userExists = await User.findOne({ username });
  if (!userExists) {
    req.statusCode = 400;
    throw new Error("Invalid username or password");
  }
  const isCorrectPassword = await verifyPassword(password, userExists.password);
  if (!isCorrectPassword) {
    req.statusCode = 400;
    throw new Error("Invalid username or password");
  }
  if (!userExists.isAdmin) {
    req.statusCode = 400;
    throw new Error("User is not admin");
  }
  const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);
  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ msg: "Logged in successfully" });
});
const logoutAdmin = asyncHandler(async (req, res, next) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ msg: "Successfully logged out" });
});
const adminDetail = asyncHandler(async (req, res) => {
  const adminDetail = await User.findById(req.user).select(["-password"]);
  return res.status(200).json({ adminDetail });
});

module.exports = {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  adminDetail,
};
