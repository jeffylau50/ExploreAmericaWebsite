const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const joi = require('joi');
const methodOverride = require('method-override')
const Dest = require('./model/destinationModel.js');
const Review = require('./model/reviews.js')
const ejsMate = require('ejs-mate')
const catchasy = require('./tool/catchasy.js')
const errorHan = require('./tool/error.js')
const DestSchema = require('./joischema.js')

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

const validateDestination = (req,res,next) => {
    const {error} = DestSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new errorHan(message, 400)
    } else{
        next();
    }
}

app.get('/destination', catchasy(async function (req, res) {
    let allDest = await Dest.find({});
    res.render('destination.ejs', {allDest})
}))

app.get('/destination/new', function (req, res){
    res.render('newForm.ejs')
})

app.post('/destination/new', validateDestination, catchasy(async function (req, res){
    let {name, price, description, location, imageURL} = req.body
    const p = new Dest({name, price, description, location, imageURL})
    p.save().then(p => console.log(p)).catch(err => console.log(err))
    res.redirect('/destination');
}))

app.get('/destination/:id', catchasy(async function (req, res){
    let destDetail = await Dest.findById(req.params.id).populate('reviews');
    console.log(destDetail)
    res.render('detail.ejs', {destDetail})
}))

app.post('/destination/:id/newreview', catchasy(async function (req, res){
    const destination = await Dest.findById(req.params.id);
    const review = new Review(req.body.review);
    destination.reviews.push(review);
    console.log(review);
    console.log(destination);
    await review.save();
    await destination.save();
    res.redirect(`/destination/${req.params.id}`);
}))


app.delete('/destination/:id/delete', catchasy(async function (req, res){
    await Dest.findByIdAndDelete(req.params.id)
    res.redirect('/destination');
}))

app.get('/destination/:id/edit', catchasy(async function (req, res){
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