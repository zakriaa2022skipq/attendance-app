const User = require("../models/user");
const admin = async (req, res, next) => {
  const userId = req.user;
  const user = await User.findOne({ _id: userId });
  if (user.isAdmin) {
    return next();
  } else {
    req.statusCode = 401;
    next({ message: "User is not admin" });
  }
};

module.exports = admin;
