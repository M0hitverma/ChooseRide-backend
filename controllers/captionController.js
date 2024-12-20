const captionModel = require("../models/captionSchema");
const captionService = require("../services/captionService");
const blockedTokenModel = require("../models/blockedTokenSchema");
const { validationResult } = require("express-validator");
module.exports.registerCaption = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, error: errors.array() });
  }
  try {
    const { fullname, email, password, vehicle } = req.body;
    const isExists = await captionModel.findOne({ email });
    if (isExists) {
      return res
        .status(401)
        .json({ ok: false, message: "Caption with same email already exists" });
    }
    const hashedPassword = await captionModel.hashPassword(password);
    const caption = await captionService.createCaption({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      password: hashedPassword,
      email,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });
    const token = caption.generateAuthToken();
    const refreshToken = caption.generateRefreshToken();
    await caption.updateOne({ refreshToken });
    res.cookie("token", token);
    res.cookie("refreshToken", refreshToken);

    return res.status(201).json({
      ok: true,
      message: "Caption registerd successfully",
      token,
      caption,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.loginCaption = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, error: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const caption = await captionModel.findOne({ email }).select("+password");

    if (!caption || !(await caption.comparePassword(password))) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid Email or Password " });
    }

    const token = caption.generateAuthToken();
    const refreshToken = caption.generateRefreshToken();

    await caption.updateOne({ refreshToken });

    res.cookie("token", token);
    res.cookie("refreshToken", refreshToken);
    return res.status(200).json({
      ok: true,
      message: "Caption Login Successfully",
      caption,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.getCaptionProflie = async (req, res, next) => {
  try {
    return res.status(200).json({ ok: true, caption: req.caption });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.logoutCaption = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.clearCooke("refreshToken");
    const token = req.cookies.token;
    await blockedTokenModel.create({
      token,
    });
    await captionService.updateCaption({
      captionId: req.caption._id,
      updateCaption: { refreshToken: null },
    });
    return res.status(200).json({ ok: true, message: "Logout successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};

module.exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }
    const decode = captionModel.verifyToken(refreshToken);
    const caption = await captionModel.findById(decode._id);
    if (!caption || caption.refreshToken !== refreshToken) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }
    const token = caption.generateAuthToken();
    req.cookie("token", token);
    return res.status(200).json({ ok: true, message: "Token Refreshed" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};
