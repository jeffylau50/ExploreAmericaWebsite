const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mapboxGeocoding({ accessToken: mapBoxToken});

const destinationController =require('../controller/destinationController.js')

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

router.get('/', catchasy(destinationController.index));

router.get('/new', isLoggedIn, destinationController.newform);

router.post('/new', validateDestination, upload.array('image', 10), catchasy( destinationController.newformpost));

router.get('/:id', catchasy(destinationController.detail));

router.post('/:id/newimage', isLoggedIn, upload.array('image', 10), catchasy(destinationController.detailImage));

router.delete('/:id/delete', isLoggedIn, isAuthor, catchasy(destinationController.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchasy(destinationController.edit))

router.patch('/:id/edit',validateDestination, catchasy(destinationController.patch))

module.exports = router;