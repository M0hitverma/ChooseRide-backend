const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
});

captionSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token; 
};
captionSchema.methods.comparePassword = async function (password) {
  
  const result =  await bcrypt.compare(password,this.password);
  return result;
};
captionSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, parseInt(process.env.BCRYPT_KEY));
};
module.exports = mongoose.model("captionModel", captionSchema);
