const asyncHandler = require("express-async-handler");

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized for this request");
  }
});

module.exports = isAdmin;
