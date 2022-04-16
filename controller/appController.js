const Dest = require('../model/destinationModel.js');
const User = require('../model/userModel.js');

module.exports.loginGet = function (req,res){
    res.locals.title = "LogIn";
    res.render('login.ejs')
};

module.exports.loginPost = (req, res) => {
    req.flash('success', 'You are logged in!');
    res.redirect('/destination'); 
  };

module.exports.registerGet = function (req, res){
    res.locals.title = "New User";
    res.render('NewUserRegister.ejs')
};

module.exports.newUserpost = async function(req, res){
    try{
    const {email, username, password} = req.body;
    let isAdmin=false;
    const newUser = new User({email, username, isAdmin});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => { if (err) return next(err)})
    req.flash('success', 'Your account was created successfully and you are now logged in!')
    res.redirect('/destination')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
};

module.exports.logout = function (req, res){
    req.logout();
    req.flash('success', 'You are logged out.')
    res.redirect('/destination')
};

module.exports.homepage = function (req, res) {
    res.render('homepage.ejs')
}

