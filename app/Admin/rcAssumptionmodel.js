var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var adminRc = {
    type: { type: String },
    value: { type: String },
    Repair_Level: { type: String },
    price: { type: Number }

};

var rcAssumptionSchema = mongoose.Schema(adminRc);

mongoose.model("rcaprofiles", rcAssumptionSchema);

