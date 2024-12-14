const mongoose = require('mongoose');

function connectToDatabase(){
    mongoose.connect(process.env.MONGOOSEURL,{
      dbName: process.env.DBNAME
    }).then(()=>{
        console.log("Database Connected Successfully");
    }).catch((error)=>{
       console.log("Error while connecting database: ", error);
    })
}

module.exports = connectToDatabase;