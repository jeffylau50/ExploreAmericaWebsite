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
const MongoStore = require('connect-mongo');
const appController = require('./controller/appController.js')
const dbURL = process.env.MONGODB_URI
//process.env.DBURL


const User = require('./model/userModel.js');
const ejsMate = require('ejs-mate');
const catchasy = require('./tool/catchasy.js');
const errorHan = require('./tool/error.js');

//'mongodb://localhost:27017/exploreamerica'

mongoose.connect(dbURL)
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

const secret = process.env.SECRET;

if (!dbURL) throw new Error('MONGODB_URI environment variable not set!');
if (!process.env.SECRET) throw new Error('SECRET environment variable not set!');

const store = MongoStore.create({
    mongoUrl: dbURL,
    
    touchAfter: 24 * 60 * 60,
    crypto: {
    secret: process.env.SECRET
    }
});

store.on("error", function (e){
    console.log('store error', e)
})


const sessionConfig = {
    store,
    name: 'EA',
    secret: secret,
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

app.get('/login', appController.loginGet)

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), appController.loginPost )

app.get('/register', appController.registerGet);

app.post('/register/new', catchasy(appController.newUserpost));

app.get('/logout', appController.logout)

app.get('/', appController.homepage)

app.all('*', (req, res, next) => {
     next(new errorHan('Page Not Found :(', 404))
 })

 app.use((err, req, res, next) => {
 const {statusCode = 500} = err;
 if (!err.message) err.message = 'Something went Wrong :('
 res.status(statusCode).render('errorPage.ejs', {err})
 })

 const port = process.env.PORT

app.listen(port) 