const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Dest = require('./model/destinationModel.js');

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

app.get('/destination', function (req, res) {
    const dest1 = new Dest({ name: 'Santa Monica Pier', price: 15, description: 'Amusement Park near the beach', location: 'Santa Monica, California' })
    dest1.save();
    console.log(dest1)
    res.render('destination.ejs')
})

app.listen(3500)