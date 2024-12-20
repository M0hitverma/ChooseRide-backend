const captionModel = require("../models/captionSchema");
module.exports.createCaption = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    throw new Error("All fields are required");
  }
  const caption = captionModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      color,
      plate,
      capacity,
      vehicleType,
    },
  });
  return caption;
};
module.exports.updateCaption= async({captionId, updateCaption})=>{
      if(!captionId || !updateCaption){
        throw new Error("All fields are required");
      }
      return captionModel.findByIdAndUpdate(captionId, { $set: updateCaption})
}