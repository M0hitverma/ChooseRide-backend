const express = require("express");
const app = express();
const cors = require("cors");
const connectToDatabase = require("./db/db");
const userRoutes = require("./routes/userRoute");
const captionRoutes = require('./routes/captionRoutes');
const cookieParser = require('cookie-parser');
require("dotenv").config();
connectToDatabase();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ? need to explore

app.use("/users", userRoutes);
app.use("/captions", captionRoutes);
module.exports = app;
