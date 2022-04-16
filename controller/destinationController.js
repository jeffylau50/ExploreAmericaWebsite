const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mapboxGeocoding({ accessToken: mapBoxToken});
const destinationController =require('../controller/destinationController.js');
const DestSchema = require('../Destjoischema');
const catchasy = require('../tool/catchasy.js');
const errorHan = require('../tool/error.js');
const Dest = require('../model/destinationModel.js');
const Review = require('../model/reviews.js');


module.exports.index = async function (req, res) {
    let allDest = await Dest.find({});
    let randomNum = Math.floor(Math.random() * allDest.length);
    res.locals.title = "Destinations";
    res.render('destination.ejs', {allDest, randomNum})
}

module.exports.newform = function(req, res){
    res.locals.title = "New Destination";
    res.render('newForm.ejs')
}

module.exports.newformpost = async function (req, res){
    let image = [];
    if(req.files){
        for(i=0;i<req.files.length;i++){
        image.unshift({URL : req.files[i].path, fileName: req.files[i].filename})
        }
    }
     let {name, price, description, location} = req.body

     let geoData = await geoCoder.forwardGeocode({
       query: location,
       limit: 1
   }).send()
     let geometry = geoData.body.features[0].geometry
     let author = req.user._id;
     const p = new Dest({name, price, description, location, geometry, image, author})
     p.save().then(p => console.log(p)).catch(err => console.log(err))
     req.flash('success', 'New Destination was successfully created!')
     res.redirect('/destination');
}

module.exports.detail = async function (req, res){
    let destDetail = await Dest.findById(req.params.id).populate({path: 'reviews', populate:{path: 'author'}}).populate('author');
    res.locals.title = `${destDetail.name}`;
    if (destDetail.geometry.coordinates.length<1){destDetail.geometry.coordinates = [  -118.2439, 34.0544 ]};
    res.render('detail.ejs', {destDetail})
}

module.exports.detailImage = async function (req, res){
    let imageNew = [];
     if(req.files){
         for(i=0;i<req.files.length;i++){
         imageNew.unshift({URL : req.files[i].path, fileName: req.files[i].filename})
         }
     }
     let {image} = await Dest.findById(req.params.id)
     image.unshift(...imageNew)
     await Dest.findByIdAndUpdate(req.params.id,{image})
     req.flash('success', 'New Images was successfully added!')
     res.redirect(`/destination/${req.params.id}`);
}

module.exports.delete = async function (req, res){
    let {image} = await Dest.findById(req.params.id);
    for(i=0;i<image.length;i++){
    await cloudinary.uploader.destroy(image[i].fileName)
}
    await Dest.findByIdAndDelete(req.params.id)
    req.flash('success', 'Destination was deleted successfully!')
    res.redirect('/destination');
}

module.exports.edit = async function (req, res){
    res.locals.title = "Edit Destination";
    let destDetail = await Dest.findById(req.params.id)
    res.render('editForm.ejs', {destDetail})
}

module.exports.patch = async function (req, res){
    let {name, price, description, location, imageURL} = req.body
    await Dest.findByIdAndUpdate(req.params.id, {name, price, description, location, imageURL})
    res.redirect(`/destination/${req.params.id}`);
}