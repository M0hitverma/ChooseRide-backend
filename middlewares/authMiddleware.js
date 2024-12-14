const jwt = require("jsonwebtoken");
const blockedTokenModel = require("../models/blockedTokenSchema");
module.exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token || (await blockedTokenModel.findOne({ token }))) {
    return res.status(401).json({ ok: false, message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      return res
        .status(401)
        .json({ ok: false, message: "Unauthorized access" });
    }
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};
