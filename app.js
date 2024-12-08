const express = require('express');
const app  = express();
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
app.use(cors());
app.get('/',(req,res)=>{
    res.status(200).json({message: "successfull"});
})
module.exports = app;
