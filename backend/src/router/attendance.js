const asyncHandler = require("../util/asyncHandler");
const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");
const express = require("express");
const {
  addAttendance,
  attendanceOfLesson,
  studentAttendanceInLesson,
} = require("../controller/attendance");
const router = express.Router();
router
  .route("/add")
  .post(authMiddleware, asyncHandler(adminMiddleware), addAttendance);
router
  .route("/")
  .post(authMiddleware, asyncHandler(adminMiddleware), attendanceOfLesson),
  router.route("/student/lesson").post(studentAttendanceInLesson);

module.exports = router;
