const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { config } = require("../config");
const captionSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "first name must be atleast 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "last name must be atleast 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "email must be atleast 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "password must be atleast 6 characters long"],
    select: false,
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  vehicle: {
    color: {
      type: String,
      require: true,
      minlength: [3, "Color must be atleast 3 characters long"],
    },
    vehicleType: {
      type: String,
      enum: ["car", "auto", "motorcycle"],
      required: true,
    },
    capacity: {
      type: Number,
      min: [1, "Capacity must be atleast 1"],
      required: true,
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "Capacity must be atleast 3 characters long"],
    },
  },
  location: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  refreshToken: {
    type: String,
    select: false,
  },
});

captionSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
captionSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign({ _id: this._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};
captionSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};
captionSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, parseInt(config.BCRYPT_KEY));
};
captionSchema.statics.verifyToken = function (token) {
  return jwt.verify(token, config.JWT_SECRET);
};
module.exports = mongoose.model("captionModel", captionSchema);
