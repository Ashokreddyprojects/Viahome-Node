var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;


var admin = {
    email: { type: String },
    username: { type: String },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    city: { type: String },
    address: { type: String },
    phone: { type: String },
    active: { type: Boolean },
    removeAccount: { type: Boolean },
    createdDate: { type: Date, default: Date.now }
};

var adminSchema = mongoose.Schema(admin);


adminSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

adminSchema.pre('update', function(next) {
    var update = this._update;
    console.log("Hello")
    if(update.$set.password==undefined)
        {
            return  next();
        }
 else
     {
    
    this.update({}, { password: bcrypt.hashSync(this.getUpdate().$set.password, SALT_WORK_FACTOR) } );
//    console.log(this.getUpdate());
    next();
     }
  });


mongoose.model("Adminprofile", adminSchema);