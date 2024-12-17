const jwt = require("jsonwebtoken");
const captionModel = require('../models/captionSchema');
const userModel = require('../models/userSchema');
const blockedTokenModel = require("../models/blockedTokenSchema");
module.exports.authUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token || (await blockedTokenModel.findOne({ token }))) {
    return res.status(401).json({ ok: false, message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded._id);
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Unauthorized access" });
  }
};

module.exports.authCaption = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token || (await blockedTokenModel.findOne({ token }))) {
    return res.status(400).json({ ok: false, message: "Unauthorized access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.caption = await captionModel.findById(decoded._id);
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: "Unauthorized access" });
  }
};
