const http = require('http');
const app = require('./app');
const {config}= require("./config");
const server = http.createServer(app);

server.listen(config.PORT,()=>{
    console.log(`Server started at port no ${config.PORT} successfully`);
})
