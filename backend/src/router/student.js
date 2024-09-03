const express = require("express");
const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");
const asyncHandler = require("../util/asyncHandler");
const {
  registerStudent,
  numberOfStudentsAndLessons,
  listOfStudents,
  studentDetail,
  studentDetailEmail,
} = require("../controller/student");
const router = express.Router();
router
  .route("/register")
  .post(authMiddleware, asyncHandler(adminMiddleware), registerStudent);
router
  .route("/studentsandlessons")
  .get(
    authMiddleware,
    asyncHandler(adminMiddleware),
    numberOfStudentsAndLessons
  );
router
  .route("/all")
  .get(authMiddleware, asyncHandler(adminMiddleware), listOfStudents);
router
  .route("/detail/:studentId")
  .get(authMiddleware, asyncHandler(adminMiddleware), studentDetail);
router.route("/detail/email").post(studentDetailEmail);

module.exports = router;
