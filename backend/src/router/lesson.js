const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../util/asyncHandler");

const express = require("express");
const {
  addLesson,
  addStudentToLesson,
  listOfLessons,
  removeStudentFromLesson,
  studentsInLesson,
} = require("../controller/lesson");
const router = express.Router();
router
  .route("/add")
  .post(authMiddleware, asyncHandler(adminMiddleware), addLesson);
router
  .route("/student/add")
  .post(authMiddleware, asyncHandler(adminMiddleware), addStudentToLesson);
router
  .route("/student/remove")
  .post(authMiddleware, asyncHandler(adminMiddleware), removeStudentFromLesson);
router
  .route("/students/all")
  .post(authMiddleware, asyncHandler(adminMiddleware), studentsInLesson);
router
  .route("/all")
  .get(authMiddleware, asyncHandler(adminMiddleware), listOfLessons),
  (module.exports = router);
