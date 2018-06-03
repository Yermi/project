var mongoose = require('mongoose');
var dbURI = "mongodb://localhost:27017/mongod";
var db = mongoose.createConnection(dbURI, function () {
    console.log("connected to mongoDB");
    User.findOne({ role: 'admin' }, function(err, user) {
        if (err) throw err;
        if(!user){ // create a user administrator, if there is no one
            User.create({
                firstName: 'Israel',
                lastName: 'Israeli',
                email: 'israel@israel.com',
                password: hashingPass('1234'),
                role: 'admin'
            }, function(err, user) {
                if (err) throw err;
            });
        }
        else {
            console.log("-----user admin-----")
            console.log("email   : israel@israel.com");
            console.log("password: 1234");
        }
    });
});

var bcrypt   = require('bcrypt-nodejs');


var Schema = mongoose.Schema;
var possibleRoles = ['user','admin'];

// define the schema for our user model
var userSchema = new Schema({
    firstName    : String,
    lastName     : String,
    email        : String,
    password     : { type: String, min: [4, 'password must contain at least 4 characters'], required: [true, 'password require'] },
    role         : { type: String, enum: possibleRoles, default: 'user'}
});
// ================= methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', function (next) {
    if(this.role === null || this.role === undefined) {
        this.role = 'user';
    }
    next();
});

function hashingPass(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
// create the model for users and expose it to our app
var User = db.model('User', userSchema);
module.exports = User;
