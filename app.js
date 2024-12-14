const express = require("express");
const app = express();
const cors = require("cors");
const connectToDatabase = require("./db/db");
const userRoutes = require("./routes/userRoute");
const cookieParser = require('cookie-parser');
require("dotenv").config();
connectToDatabase();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ? need to explore

app.use("/users", userRoutes);

module.exports = app;
