const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Dest = require('./model/destinationModel.js');
const { defaultMaxListeners } = require('events');
const res = require('express/lib/response');
const { findByIdAndDelete } = require('./model/destinationModel.js');

mongoose.connect('mongodb://localhost:27017/exploreamerica')
    .then(() => {
        console.log('DB connection open')
    })
    .catch(err => {
        console.log(err)
    })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'views');
app.use(methodOverride('_method'))

app.get('/destination', async function (req, res) {
    let allDest = await Dest.find({});
    res.render('destination.ejs', {allDest})
})

app.get('/destination/new', function (req, res){
    res.render('newForm.ejs')
})

app.post('/destination/new', async function (req, res){
    let {name, price, description, location} = req.body
    const p = new Dest({name, price, description, location})
    p.save().then(p => console.log(p)).catch(err => console.log(err))
    res.redirect('/destination');
})

app.get('/destination/:id', async function (req, res){
    let destDetail = await Dest.findById(req.params.id)
    res.render('detail.ejs', {destDetail})
})

app.delete('/destination/:id/delete', async function (req, res){
    await Dest.findByIdAndDelete(req.params.id)
    res.redirect('/destination');
})

app.listen(3500)