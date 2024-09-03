const Attendance = require("../models/attendance");
const asyncHandler = require("express-async-handler");
const { startOfDay, endOfDay } = require("date-fns");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const addAttendance = asyncHandler(async (req, res) => {
  const { studentId, lessonId, status, date } = req.body;
  const startDate = startOfDay(new Date(date));
  const endDate = endOfDay(new Date(date));
  const attendance = await Attendance.findOneAndUpdate(
    { studentId, lessonId, date: { $gte: startDate, $lte: endDate } },
    { studentId, lessonId, status, date },
    { upsert: true, new: true }
  );
  return res.status(201).json({ msg: "attendance added successfully" });
});
const attendanceOfLesson = asyncHandler(async (req, res) => {
  const { lessonId, date } = req.body;
  const startDate = startOfDay(new Date(date));
  const endDate = endOfDay(new Date(date));
  const attendance = await Attendance.aggregate([
    {
      $match: {
        lessonId: new ObjectId(lessonId),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $project: {
        "student.firstName": 1,
        "student.lastName": 1,
        status: 1,
        "student._id": 1,
      },
    },
  ]);
  return res.status(200).json({ attendance });
});

const studentAttendanceInLesson = asyncHandler(async (req, res) => {
  const { studentId, lessonId } = req.body;
  const attendanceDetail = await Attendance.aggregate([
    {
      $match: {
        lessonId: new ObjectId(lessonId),
        studentId: new ObjectId(studentId),
      },
    },
    {
      $project: {
        date: 1,
        status: 1,
      },
    },
    { $sort: { date: -1, _id: 1 } },
  ]);
  return res.status(200).json({ attendanceDetail });
});

module.exports = {
  addAttendance,
  attendanceOfLesson,
  studentAttendanceInLesson,
};
