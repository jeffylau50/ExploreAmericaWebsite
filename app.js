const express = require('express')
const app = express()
const path = require ('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'views');
app.use(methodOverride('_method'))

app.get('/destination', function (req, res){
    res.render('destination.ejs')
})

app.listen(3500)