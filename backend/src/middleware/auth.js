const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    req.statusCode = 401;
    next({ message: "User unauthorized" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.id;
    return next();
  } catch {
    req.statusCode = 401;
    next({ message: "User unauthorized" });
  }
};

module.exports = auth;
