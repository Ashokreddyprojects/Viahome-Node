const mongoose = require("mongoose");
const config = require("./config");

module.exports = function () {
    let connectionString = config.dbConnection;
    mongoose.connect(connectionString).then(() => {
        console.log("Database connected");
    }).catch((error) => {
        console.log("Error in connecting to Database");
    });

    //register your schema at time of loading the application.
    require("../app/Register/Register.model");
    require("../app/Projects/Project.model");
    require("../app/Admin/Admin.model");
    require("../app/Admin/rcAssumptionmodel");
    require("../app/Admin/medianincome.model");
    require("../app/Admin/fmrRents.model");
    require("../app/Register/forget.model");

}