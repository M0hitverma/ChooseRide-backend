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

    res.cookie("token", token);
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
    const token = req.cookies.token;
    await blockedTokenModel.create({
      token,
    });
    return res.status(200).json({ ok: true, message: "Logout successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  }
};
