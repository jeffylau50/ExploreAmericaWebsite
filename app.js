if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const joi = require('joi');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const destinationRoutes = require('./routes/destination.js')
const reviewRoutes = require('./routes/review.js')
const mongoSanitize = require('express-mongo-sanitize')
const dbURL = process.env.DBURL


const User = require('./model/userModel.js');
const ejsMate = require('ejs-mate');
const catchasy = require('./tool/catchasy.js');
const errorHan = require('./tool/error.js');

//'mongodb://localhost:27017/exploreamerica'

mongoose.connect('mongodb://localhost:27017/exploreamerica')
    .then(() => {
        console.log('database connected')
    })
    .catch(err => {
        console.log(err)
    })

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.use(mongoSanitize())

const sessionConfig = {
    name: 'EA',
    secret: 'SuperSecretStuff',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 30,
        maxAge: 1000 * 60 * 30
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/destination', destinationRoutes)
app.use('/destination/:id/review', reviewRoutes )

app.get('/login', function (req,res){
    res.locals.title = "LogIn";
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
  req.flash('success', 'You are logged in!');
  res.redirect('/destination'); 
})

app.get('/register', function (req, res){
    res.locals.title = "New User";
    res.render('NewUserRegister.ejs')
})

app.post('/register/new', catchasy(async function(req, res){
    try{
    const {email, username, password} = req.body;
    if(username=='admin1'){isAdmin=true};
    const newUser = new User({email, username, isAdmin});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => { if (err) return next(err)})
    req.flash('success', 'Your account was created successfully and you are now logged in!')
    res.redirect('/destination')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

app.get('/logout', function (req, res){
    req.logout();
    req.flash('success', 'You are logged out.')
    res.redirect('/destination')
})

app.get('/', function (req, res) {
    res.render('homepage.ejs')
})

// app.all('*', (req, res, next) => {
//     next(new errorHan('Page Not Found :(', 404))
// })

// app.use((err, req, res, next) => {
// const {statusCode = 500} = err;
// if (!err.message) err.message = 'Something went Wrong :('
// res.status(statusCode).render('errorPage.ejs', {err})
// })

app.listen(3500) 