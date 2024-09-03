const express = require("express");
const adminMiddleware = require("../middleware/admin");
const authMiddleware = require("../middleware/auth");
const {
  registerAdmin,
  loginAdmin,
  adminDetail,
  logoutAdmin,
} = require("../controller/admin");
const asyncHandler = require("../util/asyncHandler");

const router = express.Router();
router.route("/register").post(registerAdmin);
router.route("/signin").post(loginAdmin);
router.route("/logout").post(authMiddleware, logoutAdmin);
router.route("/detail").get(authMiddleware, adminDetail);

module.exports = router;
