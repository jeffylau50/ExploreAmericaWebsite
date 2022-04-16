const express = require('express');
const router = express.Router({ mergeParams: true});
const catchasy = require('../tool/catchasy.js');
const Review = require('../model/reviews.js');
const Dest = require('../model/destinationModel.js');
const ReviewSchema = require('../Reviewjoischema.js');
const joi = require('joi');
const reviewController = require('../controller/reviewController.js')

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        req.flash('error', 'You must sign in first!');
        return res.redirect('/login');
    }
    next();
}

const isAuthorforReview = async (req, res, next) =>{
    const { id } = req.params;
    const { reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (review.author.equals(req.user._id) || res.locals.currentUser.isAdmin === true){
        return next();
    } else {
        req.flash('error', 'Action is not permitted.');
        return res.redirect(`/destination/${id}`);
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

router.post('/', isLoggedIn, validateReview, catchasy(reviewController.review));

router.delete('/:reviewID', isLoggedIn, isAuthorforReview, catchasy((reviewController.deleteReview)))


module.exports = router;