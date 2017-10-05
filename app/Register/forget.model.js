var mongoose = require('mongoose'),
Schema = mongoose.Schema;



var ForgetData = {
UserId: { type: String },
Status: { type: String },
createdDate: { type: Date, default: Date.now}

};

var ForgetSchema = mongoose.Schema(ForgetData);
mongoose.model("Forgetpwd", ForgetSchema);