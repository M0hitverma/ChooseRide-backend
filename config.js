require('dotenv').config();

module.exports.config = {
    PORT: process.env.PORT,
    DBNAME: process.env.DBNAME,
    DBURL: process.env.MONGOOSEURL,
    JWT_SECRET: process.env.JWT_SECRET,
    BCRYPT_KEY: process.env.BCRYPT_KEY
}