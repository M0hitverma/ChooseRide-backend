const express = require("express");
const router = express.Router();
const captionController = require("../controllers/captionController");
const { body } = require("express-validator");
const  authMiddleware  = require("../middlewares/authMiddleware");

//Register Caption
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be atleast 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 characters long"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Color must be atleast 3 characters long"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Plate no must be atleast 3 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be atleast 1"),
    body("vehicle.vehicleType")
      .isIn(["car", "auto", "motorcycle"])
      .withMessage("Invalid vehicle type"),
  ],
  captionController.registerCaption
);

//Login Caption
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be atleast 6 characters long"),
  ],
  captionController.loginCaption
);

//Get profile
router.get("/profile", authMiddleware.authCaption, captionController.getCaptionProflie);

//Logout Caption
router.get("/logout", authMiddleware.authCaption, captionController.logoutCaption);

router.post("/refresh-token", captionController.refreshToken)
module.exports = router;
