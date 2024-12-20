const userModel = require("../models/userSchema");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
}) => {
  if (!firstname || !email || !password) {
    throw new Error("All fields are requireds");
  }
  const user = userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });

  return user;
};

module.exports.updateUser = async ({userId, updateUser})=>{
  if(!userId || !updateUser){
    throw new Error("All fields are required");
  }
  return userModel.findByIdAndUpdate(userId, { $set: updateUser});
}