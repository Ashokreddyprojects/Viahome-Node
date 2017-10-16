var Register = {};
var profileSchema = require("mongoose").model("Userprofile");
var AdminSchema = require("mongoose").model("Adminprofile");
var ForGetPwd = require("mongoose").model("Forgetpwd")
const nodemailer = require('nodemailer');


var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;


Register.register = function (req, res) {
    //console.log("TEST:",req.body);



    //User Register

    profileSchema.findOne({
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
                // req.body.city = "";
                // req.body.address = "";
                // req.body.phone = "";
                let profile = new profileSchema(req.body);
                profile.save()
                    .then(function (response) {
                        // console.log("save")

                        var out = {
                            msg: "You have registered successfully",
                            condition: true,
                            response: response

                        }
                        res.json(out);
                    })
                    .catch(function (err) {

                        var out = {
                            msg: "Your registration is failed",
                            condition: false,
                            response: err

                        }
                        res.json(out);

                    })

            } else {
                if (obj.email == req.body.email && obj.username == req.body.username) {
                    var out = {
                        msg: 'username and email already existed',
                        condition: false
                        // response:obj

                    }
                    res.json(out);

                } else if (obj.email == req.body.email) {
                    var out = {
                        msg: 'email already existed',
                        condition: false,
                        // response:obj

                    }
                    res.json(out);


                } else if (obj.username == req.body.username) {
                    var out = {
                        msg: 'username already existed',
                        condition: false,
                        // response:obj

                    }
                    res.json(out);

                }

            }


        } else {
            // console.log("error" + err);

        }


    });


}



Register.update = function (req, res) {

    var updateData = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        address: req.body.address,
        phone: req.body.phone
    }

    profileSchema.update({
        '_id': req.body.id
    }, {
            $set: updateData
        }, function (err, result) {

            if (!err) {
                var ProfileUpadte = {};

                var msg = "";
                var condition = false;
                if (result.nModified == 0) {
                    msg = 'Profile data not updated';
                    condition = false;
                    ProfileUpadte = { Update: "Failed" }

                }
                else {
                    profileSchema.findOne({ _id: req.body.id }, function (err, result1) {
                        if (!err) {
                            ProfileUpadte = result1;
                            console.log("result1" + result1)
                            msg = 'Profile data updated successfully';
                            condition = true;
                            var out = {
                                msg: msg,
                                response: result,
                                condition: condition,
                                ProfileUpadte: ProfileUpadte
                                // tokenStatus:a,
                                // token:token

                            }
                            res.json(out);

                        }
                        else {

                        }
                    });






                }

                // res.send("updated")

            } else {

                var out = {
                    msg: 'update failed like did not matched id',
                    condition: false,
                    ProfileUpadte: { Update: "Failed" }
                    // response: result

                }
                res.json(out);
                // res.send("updated Failure")

            }




        });

}

Register.delete1 = function (req, res) {
    console.log(req.body)
    console.log("Remove account")

    var RemoveAccount = {
        removeAccount: req.body.removeAccount,
    }

    profileSchema.update({
        '_id': req.body.id
    }, {
            $set: RemoveAccount
        }, function (err, result) {

            if (!err) {
                var out = {
                    msg: 'Account Removed Successfully',
                    response: result,
                    //  tokenStatus:a,
                    // token:token


                }
                res.json(out);
                // res.send("updated")

            } else {

                var out = {
                    msg: 'Unable to delete like did not matched id',
                    // response: result

                }
                res.json(out);
                // res.send("updated Failure")

            }




        });

}



Register.ActiveAccount = function (req, res) {

    profileSchema.update({
        '_id': req.body.id
    }, {
            $set: {
                active: req.body.active
            }
        }, function (err, result) {

            if (!err) {
                var out = {
                    msg: 'Active Account Successfully updated',
                    response: result,
                    // tokenStatus:a,
                    // token:token

                }
                res.json(out);
                // res.send("user Active Account updated")

            } else {
                var out = {
                    msg: 'Active Account updated Failure like did not matched id',
                    // response: result

                }
                res.json(out);
                //res.send(" Active Account updated Failure")

            }




        });


}
Register.UserLogin = function (req, res) {


    //Admin login 
    AdminSchema.findOne({
        $or: [{
            "username": req.body.username
        }, {
            "email": req.body.username
        }]
    }, function (err, result) {

        if (!err) {


            if (result != null) {

                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) return next(err);
                    bcrypt.compare(req.body.password, result.password, function (err, isMatch) {
                        if (err) {
                            // return console.error(err);
                        }

                        if (isMatch) {


                            var outPut = {
                                msg: "Admin login successfull",
                                condition: true,
                                Type: "Admin",
                                result: result,
                                // token:token,
                                Match: isMatch

                            }
                            res.json(outPut);


                        } else {
                            var outPut = {
                                msg: "Password does not match",
                                condition: false,
                                Match: isMatch

                            }
                            res.json(outPut);

                        }

                    });


                });

            }

            else {


                profileSchema.findOne({
                    $or: [{
                        "username": req.body.username
                    }, {
                        "email": req.body.username
                    }]
                }, function (err, result) {

                    if (!err) {

                        // console.log("Enter login page");


                        if ((result != null) && (result.removeAccount == true) && (result.active == true)) {
                            //console.log("Results" + result)

                            bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                                if (err) return next(err);
                                bcrypt.compare(req.body.password, result.password, function (err, isMatch) {
                                    if (err) {
                                        // return console.error(err);
                                    }

                                    if (isMatch) {

                                        var outPut = {
                                            msg: "user Login successfull",
                                            Type: "User",
                                            condition: true,
                                            result: result,
                                            //  token:token,
                                            Match: isMatch

                                        }
                                        //res.send(outPut);
                                        res.json(outPut)


                                    } else {
                                        var outPut = {
                                            msg: "Password does not match",
                                            condition: false,
                                            Match: isMatch

                                        }
                                        //res.send(outPut);
                                        res.json(outPut)
                                    }

                                });


                            });

                        }
                        else {
                            //res.send("No data pls register");
                            var outPut = {
                                msg: "Invalid User login details",
                                condition: false
                            }
                            // res.send(outPut);
                            res.json(outPut)
                        }
                    }

                    else {
                        //res.send("err", err)
                        res.json("err", err)

                    }

                });

            }
        }
        else {

            //res.send("No data pls register");
            var outPut = {
                msg: "Invalid Admin login details"
            }
            res.json(outPut);

        }


    }

    )
}


Register.findUsers = function (req, res) {

    profileSchema.find({ removeAccount: true }, function (err, obj) {

        if (!err) {

            var output = {

                msg: "Users found successfully",
                App: obj
            }

            res.json(output)
        }

        else {

            var output = {

                msg: "Users data not found",
                Error: err
            }

            res.json(output)
        }
    });
}



Register.fgtpswd = function (req, res) {
    console.log("Hello" + req.body.email)

    AdminSchema.findOne({
        email: req.body.email
    }, function (err, result) {
        var msg = ""
        if (err) {

            console.log("Err", err)
        }

        else {

            if (result == null) {
                msg: "Invalid Admin"
                var output = {
                    msg: "Invalid Admin",
                    condition: false,
                    data: null
                }

                profileSchema.findOne({

                    email: req.body.email

                }, function (err, result) {
                    var msg = ""
                    if (err) {

                        console.log("Err", err)
                    }

                    else {

                        if (result == null) {
                            msg: "Invalid User"
                            var output = {
                                msg: "Invalid User",
                                condition: false,
                                data: null
                            }


                            res.json(output)

                        }
                        else {

                            var status = {
                                UserId: result._id,
                                Status: true
                            }
                            var ForGetPwdData = new ForGetPwd(status);
                            ForGetPwdData.save()
                                .then(function (response) {

                                    var transporter = nodemailer.createTransport({
                                        service: 'Gmail',
                                        auth: {
                                            user: 'forgot@getviahome.com', // Your email id
                                            pass: 'viahome321!' // Your password
                                        }
                                    })
                                    let urlids = result._id + '/' + response._id
                                     let userName = result.lastName;
                                    var mailOptions = {
                                        from: '"GetViaHome"<forgot@getviahome.com>',
                                        to: result.email,
                                        subject: 'Password reset',
                                        text: 'To change password click below link',
                                        html: '<p>Hi ' + userName + ', </p><p>click the link below to reset your password</p><a href="http://192.168.0.52:5050/rediRectPage/' + urlids + '">Reset Password</a><br><br><br><br><p>Regards ,</p><p>GetViaHome</p>'
                                    };

                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            console.log(error);
                                            res.json("Err", error)
                                        }
                                        console.log(info)
                                        msg: "Please check  your mail to reset password"
                                        // console.log(`Message sent: ${info.response}`);
                                        var output = {
                                            msg: "Please check  your mail to reset password",
                                            condition: true,
                                            data: info
                                        }

                                        res.json(output)

                                    });

                                }).catch(function (err) {

                                })

                            console.log("result", result._id)
                            //  res.json(result)

                        }
                    }
                });


            }
            else {

                var status = {
                    UserId: result._id,
                    Status: true
                }
                var ForGetPwdData = new ForGetPwd(status);
                ForGetPwdData.save()
                    .then(function (response) {

                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'forgot@getviahome.com', // Your email id
                                pass: 'viahome321!' // Your password
                            }
                        })
                        let urlids = result._id + '/' + response._id;
                        let userName = result.lastName;
                        var mailOptions = {
                            from: '"GetViaHome"<forgot@getviahome.com>',
                            to: result.email,
                            subject: 'Password reset',
                            text: 'To change password click below link',
                            html: '<p>Hi ' +userName  + ', </p><p>click the link below to reset your password</p><a href="http://192.168.0.52:5050/rediRectPage/' + urlids + '">Reset Password</a><br><br><br><br><p>Regards ,</p><p>GetViaHome</p>'
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                                res.json("Err", error)
                            }
                            console.log(info)
                            msg: "Please check  your mail to reset password"
                            // console.log(`Message sent: ${info.response}`);
                            var output = {
                                msg: "Please check  your mail to reset password",
                                condition: true,
                                data: info
                            }

                            res.json(output)

                        });

                    })
                    .catch(function (err) {



                    })

                console.log("result", result._id)
                //            res.json(result)

            }
        }
    })
};


Register.changepswd = function (req, res) {

    console.log("Hi")
    console.log(req.body)

    profileSchema.findOne(
        {

            '_id': req.body.id
        },
        {
            password: req.body.curpswd
        },
        function (err, result) {

            var condition = false;
            var msg = "";
            if (err) {

                console.log(err)
            }
            else {

                if (result == null) {
                    msg = "Invalid password"
                    condition = false

                    var output = {
                        msg: "Invalid password",

                        data: null
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
                                msg = "Password matched";
                                condition = true;
                                var outPut = {
                                    msg: "Password matched",
                                    Type: "User",
                                    condition: true,
                                    result: result,
                                    //  token:token,
                                    Match: isMatch

                                }
                                var updateData = {

                                    password: req.body.password
                                }
                                //res.send(outPut);
                                // res.json(outPut)

                                profileSchema.update({

                                    '_id': req.body.id
                                },

                                    {
                                        $set: updateData

                                    }, function (err, result) {

                                        if (err) {

                                            console.log(err)
                                            msg = "Password not saved";
                                            condition = false;
                                            var output = {

                                                msg: "Password not saved",
                                                err: err,
                                                condition: false
                                            }
                                            res.json(output)
                                        }

                                        else {

                                            console.log(result)
                                            msg = "Password updated successfully";
                                            condition = true;
                                            var output = {

                                                msg: "Password updated successfully",
                                                result: result,
                                                condition: true
                                            }
                                            res.json(output)
                                        }
                                    }

                                )
                            } else {
                                msg = "Password does not match";
                                condition = false;

                                var outPut = {
                                    msg: "Password does not match",
                                    condition: false,
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


Register.changePwdBasedId = function (req, res) {
    console.log("HI" + req.body.id)

    let pwdChanges = {
        password: req.body.password
    }


    AdminSchema.findOne({ _id: req.body.id }, function (err, obj) {

        var msg = "";
        var condition = false

        if (!err) {
            if (obj == null) {


                profileSchema.findOne({ _id: req.body.id }, function (err, obj) {

                    if (!err) {

                        profileSchema.update({

                            '_id': req.body.id
                        },

                            {
                                $set: pwdChanges

                            }, function (err, result) {

                                var msg = "";
                                var condition = false
                                if (err) {

                                    console.log(err)

                                    msg = "User Password not saved";
                                    condition = false;
                                    var output = {

                                        msg: "User Password not saved",
                                        err: err,
                                        condition: false
                                    }
                                    res.json(output)
                                }

                                else {

                                    // console.log(result)

                                    ForGetPwd.update({

                                        '_id': req.body.UserId
                                    },

                                        {
                                            $set: { Status: false }

                                        }, function (err, status) {
                                            if (!err) { console.log("status updated") }
                                            else { console.log("status updated error") }

                                        })

                                    msg = "User Password updated successfully";
                                    condition = true;
                                    var output = {

                                        msg: "User Password updated successfully",
                                        result: result,
                                        condition: true
                                    }
                                    res.json(output)
                                }
                            })


                    }
                    else {
                        msg = "Password not saved";
                        condition = false;

                        var output = {

                            msg: "Password not saved",
                            err: err,
                            condition: false
                        }
                        res.json(output)


                    }
                })

            }
            else {

                AdminSchema.update({

                    '_id': req.body.id
                },

                    {
                        $set: pwdChanges

                    }, function (err, result) {

                        if (err) {

                            console.log(err)

                            msg = "Admin Password not saved";
                            condition = false;
                            var output = {

                                msg: "Admin Password not saved",
                                err: err,
                                condition: false
                            }
                            res.json(output)
                        }

                        else {

                            //console.log(result)

                            ForGetPwd.update({

                                '_id': req.body.UserId
                            },

                                {
                                    $set: { Status: false }

                                }, function (err, status) {
                                    if (!err) { console.log("status updated") }
                                    else { console.log("status updated error") }

                                })

                            msg = "Admin Password updated successfully";
                            condition = true

                            var output = {

                                msg: "Admin Password updated successfully",
                                result: result,
                                condition: true
                            }
                            res.json(output)
                        }
                    })
            }



        }
        else {






        }


    })

}




module.exports = Register;