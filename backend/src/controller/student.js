const Student = require("../models/student");
const Lesson = require("../models/lesson");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, username } = req.body;
//   const userExists = await User.findOne({ username });
//   if (userExists) {
//     req.statusCode = 400;
//     throw new Error("User with this username already exists");
//   }
//   const hashedPassword = await hashPassword(password);
//   let profilepic = null;
//   if (req.file) {
//     profilepic = req.file.filename;
//   }
//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     username,
//     profilepic,
//   });
//   return res.status(201).json({ msg: "user registered successfully" });
// });

// const logoutUser = asyncHandler(async (req, res, next) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return next(err);
//     }
//     return res.status(200).json({ message: "logged out successfully" });
//   });
// });
// const userDetail = asyncHandler(async (req, res) => {
//   const userDetail = await User.findById(req.user).select([
//     "-password",
//     "-following",
//   ]);
//   return res.status(200).json({ userDetail });
// });
// const updateUser = asyncHandler(async (req, res) => {
//   const userDetail = await User.findById(req.user).select([
//     "-password",
//     "-following",
//   ]);
//   return res.status(200).json({ userDetail });
// });
const registerStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const studentExists = await Student.findOne({ email });
  if (studentExists) {
    req.statusCode = 400;
    throw new Error("Student with this email already exists");
  }
  const student = await Student.create({
    firstName,
    lastName,
    email,
  });
  return res.status(201).json({ msg: "student registered successfully" });
});

const numberOfStudentsAndLessons = asyncHandler(async (req, res) => {
  const numberOfStudents = await Student.countDocuments({});
  const numberOfLessons = await Lesson.countDocuments({});
  return res.status(200).json({ numberOfLessons, numberOfStudents });
});

const listOfStudents = asyncHandler(async (req, res) => {
  const students = await Student.aggregate([
    { $match: { _id: { $exists: true } } },
    {
      $project: {
        lessons: { $size: "$lessons" },
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
      },
    },
  ]);
  return res.status(200).json({ students });
});
const studentDetail = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const studentDetail = await Student.aggregate([
    { $match: { _id: new ObjectId(studentId) } },
    {
      $lookup: {
        from: "lessons",
        localField: "lessons",
        foreignField: "_id",
        as: "lessons",
      },
    },
    {
      $project: {
        "lessons.students": 0,
        createdAt: 0,
        updatedAt: 0,
        "lessons.createdAt": 0,
        "lessons.updatedAt": 0,
      },
    },
  ]);
  return res.status(200).json({ studentDetail });
});
const studentDetailEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const studentDetail = await Student.aggregate([
    { $match: { email } },
    {
      $lookup: {
        from: "lessons",
        localField: "lessons",
        foreignField: "_id",
        as: "lessons",
      },
    },
    {
      $project: {
        "lessons.students": 0,
        createdAt: 0,
        updatedAt: 0,
        "lessons.createdAt": 0,
        "lessons.updatedAt": 0,
      },
    },
  ]);
  if (studentDetail.length < 1) {
    req.statusCode = 400;
    throw new Error(
      "Student registration does not exist. Contact Admin for registration"
    );
  }
  return res.status(200).json({ studentDetail });
});

module.exports = {
  registerStudent,
  numberOfStudentsAndLessons,
  listOfStudents,
  studentDetail,
  studentDetailEmail,
};
