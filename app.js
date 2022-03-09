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
const User = require('./model/userModel.js');
const isLoggedIn = require('./middleware');

const Dest = require('./model/destinationModel.js');
const Review = require('./model/reviews.js');
const ejsMate = require('ejs-mate');
const catchasy = require('./tool/catchasy.js');
const errorHan = require('./tool/error.js');
const DestSchema = require('./Destjoischema.js');
const ReviewSchema = require('./Reviewjoischema.js');

mongoose.connect('mongodb://localhost:27017/exploreamerica')
    .then(() => {
        console.log('DB connection open')
    })
    .catch(err => {
        console.log(err)
    })

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
const sessionConfig = {
    secret: 'SuperSecretStuff',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
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


const validateDestination = (req,res,next) => {
    const {error} = DestSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new errorHan(message, 400)
    } else{
        next();
    }
}

const validateReview = (req,res,next) => {
    const {error} = ReviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new errorHan(message, 400)
    } else{
        next();
    }
}

const isAuthor = async (req, res, next) =>{
    const { id } = req.params;
    const destination = await Dest.findById(id);
    console.log(req.user._id)
    if (!destination.author.equals(req.user._id)){
        req.flash('error', 'Action is not permitted.');
        return res.redirect(`/destination/${id}`);
    }
    next()
}

app.get('/login', function (req,res){
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
  req.flash('success', 'You are logged in!');
  res.redirect('/destination'); 
})

app.get('/register', function (req, res){
    res.render('NewUserRegister.ejs')
})

app.post('/register/new', catchasy(async function(req, res){
    try{
    const {email, username, password} = req.body;
    const newUser = new User({email, username});
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

app.get('/destination', catchasy(async function (req, res) {
    let allDest = await Dest.find({});
    res.render('destination.ejs', {allDest})
}))

app.get('/destination/new', isLoggedIn, function(req, res){
    res.render('newForm.ejs')
})

app.post('/destination/new', validateDestination, catchasy(async function (req, res){
    let {name, price, description, location, imageURL} = req.body
    let author = req.user._id;
    const p = new Dest({name, price, description, location, imageURL, author})
    p.save().then(p => console.log(p)).catch(err => console.log(err))
    req.flash('success', 'New Destination was successfully created!')
    res.redirect('/destination');
   
}))

app.get('/destination/:id', catchasy(async function (req, res){
    let destDetail = await Dest.findById(req.params.id).populate('reviews').populate('author');
    res.render('detail.ejs', {destDetail})
}))

app.post('/destination/:id/newreview', validateReview, catchasy(async function (req, res){
    const destination = await Dest.findById(req.params.id);
    const review = new Review(req.body.review);
    destination.reviews.push(review);
    await review.save();
    await destination.save();
    req.flash('success', 'New Review was successfully created!')
    res.redirect(`/destination/${req.params.id}`);
}))

app.delete('/destination/:id/review/:reviewID', catchasy((async function (req, res){
    await Dest.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewID}})
    await Review.findByIdAndDelete(req.params.reviewID)
    res.redirect(`/destination/${req.params.id}`);
})))

app.delete('/destination/:id/delete', isLoggedIn, isAuthor, catchasy(async function (req, res){
    await Dest.findByIdAndDelete(req.params.id)
    res.redirect('/destination');
}))

app.get('/destination/:id/edit', isLoggedIn, isAuthor, catchasy(async function (req, res){
    let destDetail = await Dest.findById(req.params.id)
    res.render('editForm.ejs', {destDetail})
}))

app.patch('/destination/:id/edit',validateDestination, catchasy(async function (req, res){
    let {name, price, description, location, imageURL} = req.body
    await Dest.findByIdAndUpdate(req.params.id, {name, price, description, location, imageURL})
    res.redirect(`/destination/${req.params.id}`);
}))

app.all('*', (req, res, next) => {
    next(new errorHan('Page Not Found :(', 404))
})

app.use((err, req, res, next) => {
const {statusCode = 500} = err;
if (!err.message) err.message = 'Something went Wrong :('
res.status(statusCode).render('errorPage.ejs', {err})
})

app.listen(3500)