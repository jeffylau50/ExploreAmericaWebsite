const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mapboxGeocoding({ accessToken: mapBoxToken});

const DestSchema = require('../Destjoischema');
const catchasy = require('../tool/catchasy.js');
const errorHan = require('../tool/error.js');
const Dest = require('../model/destinationModel.js');
const Review = require('../model/reviews.js');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ExploreAmerica',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

const upload = multer({storage});

const isAuthor = async (req, res, next) =>{
    const { id } = req.params;
    const destination = await Dest.findById(id);
    if (destination.author.equals(req.user._id) || res.locals.currentUser.isAdmin === true){
        return next();
    }else {
        req.flash('error', 'Action is not permitted.');
        return res.redirect(`/destination/${id}`);
    }  
}

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.flash('error', 'You must sign in first!');
        return res.redirect('/login');
    }
    next();
}

const validateDestination = (req,res,next) => {
    const {error} = DestSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new errorHan(message, 400)
    } else{
        next();
    }
}

router.get('/', catchasy(async function (req, res) {
    let allDest = await Dest.find({});
    let randomNum = Math.floor(Math.random() * allDest.length);
    res.locals.title = "Destinations";
    res.render('destination.ejs', {allDest, randomNum})
}))

router.get('/new', isLoggedIn, function(req, res){
    res.locals.title = "New Destination";
    res.render('newForm.ejs')
})

router.post('/new', validateDestination, upload.array('image', 10), catchasy(async function (req, res){
     
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
   
 }))

router.get('/:id', catchasy(async function (req, res){
    let destDetail = await Dest.findById(req.params.id).populate({path: 'reviews', populate:{path: 'author'}}).populate('author');
    res.locals.title = `${destDetail.name}`;
    if (destDetail.geometry.coordinates.length<1){destDetail.geometry.coordinates = [  -118.2439, 34.0544 ]};
    res.render('detail.ejs', {destDetail})
}))

router.post('/:id/newimage', isLoggedIn, upload.array('image', 10), catchasy(async function (req, res){
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
}))

router.delete('/:id/delete', isLoggedIn, isAuthor, catchasy(async function (req, res){
    let {image} = await Dest.findById(req.params.id);
    for(i=0;i<image.length;i++){
    await cloudinary.uploader.destroy(image[i].fileName)
}
    await Dest.findByIdAndDelete(req.params.id)
    req.flash('success', 'Destination was deleted successfully!')
    res.redirect('/destination');
}))
router.get('/:id/edit', isLoggedIn, isAuthor, catchasy(async function (req, res){
    res.locals.title = "Edit Destination";
    let destDetail = await Dest.findById(req.params.id)
    res.render('editForm.ejs', {destDetail})
}))

router.patch('/:id/edit',validateDestination, catchasy(async function (req, res){
    let {name, price, description, location, imageURL} = req.body
    await Dest.findByIdAndUpdate(req.params.id, {name, price, description, location, imageURL})
    res.redirect(`/destination/${req.params.id}`);
}))

module.exports = router;