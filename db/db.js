const mongoose = require('mongoose');
const {config} = require('../config');
function connectToDatabase(){
    mongoose.connect(config.DBURL,{
      dbName: config.DBNAME
    }).then(()=>{
        console.log("Database Connected Successfully");
    }).catch((error)=>{
       console.log("Error while connecting database: ", error);
    })
}

module.exports = connectToDatabase;