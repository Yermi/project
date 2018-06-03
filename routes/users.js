var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var passport = require('passport');
var CryptoJS = require("crypto-js");
require('../config/passport')(passport); // pass passport for configuration

var User = require('../models/user');

var reqPath = path.join(__dirname, '../views');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function (req, res) {
    console.log(reqPath);
    res.sendfile(reqPath + '/login.html');
});

router.get('/signup', function (req, res) {
    res.sendFile(reqPath + '/sign-up.html');
});

router.get('/users', function (req, res) {
    res.sendfile(reqPath + '/users.html');
});

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.html');
});

router.get('/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.send({ success: true, message: 'You are disconnected' });
});

router.post('/signup', function (req, res, next) {
    var sender = req.body.sender;
    passport.authenticate('local-signup', {
        failureFlash : true // allow flash messages
    }, function (err, user, info) {
        if (err) {
            console.log('err')
            return next(err); // will generate a 500 error
        }

        if (sender == 'user'){
            var message = 'You are registered';
        }
        else {
            var message = 'user added successfully';
        }
        return res.send({ success: true, message: message });
    })(req, res, next);
});

router.post('/login', function (req, res, next) {
    console.log(req.body.email);
    console.log(req.body.password);
    passport.authenticate('local-login', {
        failureFlash : true // allow flash messages
    }, function (err, user, info) {
        if (err) {
            console.log('err')
            return next(err); // will generate a 500 error
        }
        if (!user) {
            return res.status(401).send('user not found');
        }
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.send({ success: true, message: 'You are connected' });
        });
    })(req, res, next);
});

router.post('/upgradeUsers', isLoggedIn, function (req, res) {
    var i, length = req.body.users.length;
    for (i = 0; i < length; i++) {
        User.findByIdAndUpdate(req.body.users[i]._id,{
            $set: {'role': "admin"}
        }, function (err) {
            if (err) throw err;
        })
    };
    res.send({ success: true, message: length + ' users have been upgraded to admin' });
});

router.get('/getAll',isLoggedIn, function (req, res) {
    if (req.user.role == "admin"){
        User.find({}, (err, data) => {
            res.send(data);
        });
    }
    else if (req.user.role == "user"){
        User.find({role: 'user'}, (err,data) => {
            res.send(data);
        });
    }
});

router.get('/getProfile' , function (req, res, next) {
    var profile = {};
    var out = '';
    for (var p in req.body) {
        out += p + ': ' + req.body[p] + '\n';
    }
    console.log(out);
    if (!req.isAuthenticated()) {
        profile.loggedIn = false;
    }
    else {
        profile.loggedIn = true;
        profile.firstName = req.user.firstName;
        profile.lastName = req.user.lastName;
        profile.role = req.user.role;
        profile._id = req.user._id;
    }
    res.send(profile);
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    res.status(401).send('משתמש לא מחובר');
}

function isManager(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.user.role == "manager")
        return next();

    res.status(403).send('אין לך גישה לתוכן זה');
}

function decryptPassword(req, res, next) {
    if (req.body.email == undefined || req.body.password == undefined)
        return res.status(401).send("חסר מייל או סיסמא");
    req.body.password = CryptoJS.AES.decrypt(req.body.password, req.body.passwordKey).toString(CryptoJS.enc.Utf8);
    delete req.body.passwordKey;
    console.log(req.body)
    return next();

}

module.exports = router;
