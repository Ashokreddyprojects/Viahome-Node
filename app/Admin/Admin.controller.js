var Admin = {};

var AdminSchema = require("mongoose").model("Adminprofile");
var rcAssumptionSchema = require("mongoose").model("rcaprofiles");
var medianIncomeSchema = require("mongoose").model("mdnincmprofiles");
var fmrRentsSchema = require("mongoose").model("fmrrentsprofiles");

var ForGetPwd = require("mongoose").model("Forgetpwd")
const nodemailer = require('nodemailer');


var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

Admin.register = function (req, res) {


    // console.log("TEST:",req.body);

    AdminSchema.findOne({
        $or: [{
            username: req.body.username
        }, {
            email: req.body.email
        }]
    }, function (err, obj) {
        if (!err) {
            if (obj == null) {
                req.body.active = true;
                req.body.removeAccount = true;
                req.body.city = "NA";
                req.body.address = "NA";
                req.body.phone = "NA";
                let profile = new AdminSchema(req.body);

                profile.save()
                    .then(function (response) {
                        // console.log("save")

                        var out = {
                            msg: "success",
                            response: response
                        }

                        res.json(out);
                    })
                    .catch(function (err) {

                        // console.log(err);
                        var out = {
                            msg: "Error in save",
                            response: err
                        }
                        res.json(out);
                    })
            }


            else {
                if (obj.email == req.body.email && obj.username == req.body.username) {
                    var out = {
                        msg: "Username & Email already registered for admin"
                    }
                    res.json(out);
                } else if (obj.email == req.body.email) {
                    var out = {
                        msg: 'Email already existed',
                    }
                    res.json(out);


                } else if (obj.username == req.body.username) {
                    var out = {
                        msg: 'Username already existed',
                    }
                    res.json(out);

                }

            }

        }
        else {
            res.json(err);
            // console.log('err' +err);
        }
    })
}



Admin.update = function (req, res) {
    
        var updateData = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            address: req.body.address,
            phone: req.body.phone
        }
    
        AdminSchema.update({
            '_id': req.body.id
        }, {
                $set: updateData
            }, function (err, result) {
    
                if (!err) {
                    var ProfileUpadte={};
    
                    var msg="";
                    var condition = false;
                    if (result.nModified == 0) {
                        msg = 'Profile data not updated';
                        condition = false;
                        ProfileUpadte={Update:"Failed"}
        
                    }
                    else {  
                        AdminSchema.findOne({_id:req.body.id}, function (err, result1) {
                                   if(!err)
                                       {
                                           ProfileUpadte=result1;
                                           console.log("result1"+result1)
                                                msg = 'Profile data updated successfully';
                                                condition = true;
                                               var out = {
                        msg: msg,
                        response: result,
                        condition: condition,
                        ProfileUpadte:ProfileUpadte
                        // tokenStatus:a,
                        // token:token
    
                    }
                    res.json(out);
                                           
                                       }
                                        else
                                       {
                                           
                                       }
                               });
                        
                        
                        
                        
                     
        
                    }
                
                    // res.send("updated")
    
                } else {
    
                    var out = {
                        msg: 'update failed like did not matched id',
                        condition: false,
                        ProfileUpadte:{Update:"Failed"}
                        // response: result
    
                    }
                    res.json(out);
                    // res.send("updated Failure")
    
                }
    
    
    
    
            });
    
    }


Admin.medianIncome = function (req, res) {

    medianIncomeSchema.find({}, function (err, result) {

        if (err) {

            // console.log(err);
            res.json(err)

        }
        else {

            // console.log(result);
            var output = {
                msg: "Found data successfully",
                condition: true,
                App: result
            }
            res.json(output)
        }

    });

}


Admin.updateMedianIncome = function (req, res) {

    // console.log(req.body)

    let updateData = {
        Area_Name: req.body.Area_Name,
        Median_Income_2017: req.body.Median_Income_2017,
        Person_1: req.body.Person_1,
        People_2: req.body.People_2,
        People_3: req.body.People_3,
        People_4: req.body.People_4,
        People_5: req.body.People_5,
        People_6: req.body.People_6,
        People_7: req.body.People_7,
        People_8: req.body.People_8

    }


    medianIncomeSchema.update({
        '_id': req.body.id
    }, {
            $set: updateData
        }, function (err, result) {

            if (!err) {

                var msg = "";
                var condition = false;
                if (result.nModified == 0) {
                    msg = 'Median Income data not modified';
                    condition = false;

                }
                else {
                    msg = "Median Income data updated successfully";
                    condition = true;

                }
                var output = {
                    msg: msg,
                    response: result,
                    condition: condition
                    // token:token
                }
                res.json(output)

            }

            else {
                var output = {
                    // Error: err,
                    msg: 'MedianIncome data updation failed - id did not match',
                    condition: false
                }
                res.json(output);

            }

        });

}

Admin.deleteMedianIncome = function (req, res) {



    medianIncomeSchema.deleteOne({ _id: req.body.id }, function (err, result) {

        if (!err) {
            var out = {
                msg: 'Data Removed Successfully',
                condition: true,
                response: result

            }
            res.json(out);

        }

        else {
            var out = {
                msg: 'Unable to delete data - did not match id',
            }
            res.json(out);


        }
    });
}

Admin.addMedianIncomeData = function (req, res) {

    //console.log(req.body)

    let data = new medianIncomeSchema(req.body);
    data.save()
        .then(function (response) {
            // console.log("save")
            var out = {
                msg: "Median Income data successfully added",
                condition: true,
                response: response
            }
            res.json(out);
        })
        .catch(function (err) {
            // console.log(err);
            var out = {
                msg: "Error in addding Median Income Data",
                condition: false,
                response: err
            }
            res.json(out);
        })
}

Admin.fmrRents = function (req, res) {
    fmrRentsSchema.find({}, function (err, result) {

        if (err) {

            // console.log(err);
            res.json(err)

        }
        else {

            // console.log(result);
            res.json(result)
        }

    });
}

Admin.addfmrRents = function (req, res) {

    let data = new fmrRentsSchema(req.body);
    data.save()
        .then(function (response) {
            // console.log("save")
            var out = {
                msg: "MTSP data successfully added",
                condition: true,
                response: response
            }
            res.json(out);
        })
        .catch(function (err) {
            // console.log(err);
            var out = {
                msg: "Error in addding MTSP Data",
                condition: false,
                response: err
            }
            res.json(out);
        })

}

Admin.updatefmrRents = function (req, res) {
    //console.log(req.body)

    let updateData = {

        Area_Name: req.body.Area_Name,
        Median_Income_2017: req.body.Median_Income_2017,
        Person_1: req.body.Person_1,
        People_2: req.body.People_2,
        People_3: req.body.People_3,
        People_4: req.body.People_4,
        People_5: req.body.People_5,
        People_6: req.body.People_6,
        People_7: req.body.People_7,
        People_8: req.body.People_8,
        State: req.body.State,

    }

    fmrRentsSchema.update({
        '_id': req.body.id
    }, {
            $set: updateData
        }, function (err, result) {

            if (!err) {

                var msg = "";
                var condition = false;
                if (result.nModified == 0) {
                    msg = 'MULTIFAMILY TAX SUBSIDY PROGRAM RENTS data not modified';
                    condition = false;

                }
                else {
                    msg = 'MULTIFAMILY TAX SUBSIDY PROGRAM RENTS data updated successfully';
                    condition = true;

                }

                var output = {
                    msg: msg,
                    condition: condition,
                    response: result,
                    // token:token
                }
                res.json(output)

            }

            else {
                var output = {
                    // Error: err,
                    msg: 'MULTIFAMILY TAX SUBSIDY PROGRAM RENTS data updation failed - id did not match',
                    condition: condition
                }
                res.json(output);

            }

        });
}


Admin.deletefmrRents = function (req, res) {


    fmrRentsSchema.deleteOne({ _id: req.body.id }, function (err, result) {

        if (!err) {
            var out = {
                msg: 'Data Removed Successfully',
                response: result,
                // tokenStatus:a,
                // token:token
            }
            res.json(out);

        }

        else {
            var out = {
                msg: 'Unable to delete data - did not match id',
            }
            res.json(out);


        }
    });
}

Admin.rcAssumption = function (req, res) {

    rcAssumptionSchema.find({}, function (err, obj) {

        if (err) {

            //  console.log(err);
            res.json(err)

        }
        else {

            //  console.log(obj)
            res.json(obj)
        }

    });
}

Admin.addRCAData = function (req, res) {

    let data = new rcAssumptionSchema(req.body);
    data.save()
        .then(function (response) {
            // console.log("save")
            var out = {
                msg: "RCA data successfully added",
                condition: true,
                response: response
            }
            res.json(out);
        })
        .catch(function (err) {
            // console.log(err);
            var out = {
                msg: "Error in addding RCA Data",
                condition: false,
                response: err
            }
            res.json(out);
        })

}

Admin.updateRCAData = function (req, res) {
    // console.log(req.body)

    let updateData = {

        type: req.body.type,
        value: req.body.value,
        Repair_Level: req.body.Repair_Level,
        price: req.body.price
    }

    rcAssumptionSchema.update({
        '_id': req.body.id
    }, {
            $set: updateData
        }, function (err, result) {

            if (!err) {

                var msg = "";
                var condition = false;
                if (result.nModified == 0) {
                    msg = 'RC Assumptions data not modified';
                    condition = false;

                }
                else {
                    msg = 'RC Assumptions updated successfully';
                    condition = true;

                }
                var output = {
                    msg: msg,
                    condition: condition,
                    response: result,
                    // token:token
                }
                res.json(output)

            }

            else {
                var output = {
                    // Error: err,
                    msg: 'RC Assumptions data updation failed - id did not match',
                    condition: false
                }
                res.json(output);

            }

        });
}

Admin.deleteRCAData = function (req, res) {

    rcAssumptionSchema.deleteOne({ _id: req.body.id }, function (err, result) {

        if (!err) {
            var out = {
                msg: 'Data Removed Successfully',
                response: result,
                // tokenStatus:a,
                // token:token
            }
            res.json(out);

        }

        else {
            var out = {
                msg: 'Unable to delete data - did not match id',
            }
            res.json(out);


        }
    });
}


Admin.adminchangepswd = function(req, res) {

    console.log("Hi")
    console.log(req.body)
    
    AdminSchema.findOne(
        {

        '_id': req.body.id
        },
        {
            password: req.body.curpswd
        }, 
        function(err, result) {

        var condition = false;
        var msg="";
    if(err) {

        console.log(err)
    }
    else {

        if(result==null)
        {
            msg= "Invalid password"
            condtion= false
          
            var output = {
            msg: "Invalid password",
           
            data:null
        }
        console.log(output)
        res.json(output)

        }

        else {

            bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                if (err) return next(err);
                bcrypt.compare(req.body.curpswd, result.password, function (err, isMatch) {
                    if (err) {
                        // return console.error(err);
                    }

                    if (isMatch) {
                        msg= "Password matched";
                        condition = true;
                        var outPut = {
                            msg: "Password matched",
                            Type:"User",
                            condition:true,
                            result: result,
                            //  token:token,
                            Match: isMatch

                        }
                        var updateData = {

                            password: req.body.password
                        }
                        //res.send(outPut);
                        // res.json(outPut)

                        AdminSchema.update({

                        '_id': req.body.id}, 

                        {$set: updateData

                        }, function(err, result) {

                        if(err) {

                            console.log(err)
                            var output = {

                            msg: "Password not saved",
                            err:err,
                            condtion: false
                            }
                            res.json(output)
                        }

                        else {

                            console.log(result)
                           
                            var output = {

                            msg:"Password updated successfully",
                            result:result,
                            condtion: true
                            }
                            res.json(output)
                        }
                    }

                )
                    } else {
                        msg= "Password does not match";
                        condition=false;

                        var outPut = {
                            msg: "Password does not match",
                            condition:false,
                            Match: isMatch

                        }
                        //res.send(outPut);
                        res.json(outPut)
                    }

                });


            });
    
            } 

        }
    })

}



module.exports = Admin;