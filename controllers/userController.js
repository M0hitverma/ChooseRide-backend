const userModel = require("../models/userSchema");
const userService = require("../services/userService");
const { validationResult } = require("express-validator");
const blockedTokenModel = require("../models/blockedTokenSchema");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, error: errors.array() });
  }
  try {
    const { fullname, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ ok: false, message: "User already exists" });
    }
    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashPassword,
    });
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    await user.updateOne({ refreshToken });
    res.cookie("token", token);
    res.cookie("refreshToken", refreshToken);
    return res
      .status(201)
      .json({ ok: true, user: user, message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, error: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid Email or Password" });
    }

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    await user.updateOne({ refreshToken });
    res.cookie("refreshToken", refreshToken);
    res.cookie("token", token);
    return res.status(200).json({ ok: true, token, user, message: "Login Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, error, message: "Internal server error" });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    return res.status(200).json({ ok: true, user: req.user });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    const token = req.cookies.token;
    await blockedTokenModel.create({
      token,
    });
    await userService.updateUser({
      userId: req.user._id,
      updateUser: { refreshToken: null },
    });

    return res.status(200).json({ ok: true, message: "Logout Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Interval server error", error });
  }
};

module.exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  try {
    const decode = userModel.verifyToken(refreshToken);
    const user = await userModel.findById(decode._id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }
    const token = user.generateAuthToken();
    res.cookie("token", token);
    return res.status(200).json({ ok: true, message: "Token Refreshed" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error", error });
  }
};
