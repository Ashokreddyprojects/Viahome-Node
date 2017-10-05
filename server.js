var ip = require("ip");
var config = require("./config/config");
var express = require("./config/express");
var mongoose = require("./config/database-mongoose");
mongoose();



var server = express();
server.listen(config.port);
console.log("Application running on port:" + config.port);
console.log("http://localhost:" + config.port + "/");
console.dir("http://" + ip.address() + ':' + config.port + "/");