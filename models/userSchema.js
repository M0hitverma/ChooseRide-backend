const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {config} = require("../config");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be atleast 3 characters long"],
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: [5, "Email must be at least 5 characters long"],
  },
  socketId: {
    type: String,
  },
  refreshToken: {
    type: String,
    select: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  
  const token = jwt.sign({ _id: this._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, parseInt(config.BCRYPT_KEY));
};
userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign({ _id: this._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  return refreshToken;
};
userSchema.statics.verifyToken = function (token){
  return jwt.verify(token, config.JWT_SECRET)
}
module.exports = mongoose.model("userModel", userSchema);
