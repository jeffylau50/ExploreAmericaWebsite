const express = require('express');
const router = express.Router({ mergeParams: true});
const catchasy = require('../tool/catchasy.js');
const Review = require('../model/reviews.js');
const Dest = require('../model/destinationModel.js');
const ReviewSchema = require('../Reviewjoischema.js');
const joi = require('joi');

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

router.post('/', isLoggedIn, validateReview, catchasy(async function (req, res){
    if(req.body.review.rating==0){
        req.flash('error', 'Rating cannot be 0. Please try again'); 
        return res.redirect(`/destination/${req.params.id}`);
   
    }
    const destination = await Dest.findById(req.params.id);
    const {reviewText, rating} = req.body.review;
    const author = req.user._id;
    const review = new Review({reviewText, rating, author});
    destination.reviews.push(review);
    await review.save();
    await destination.save();
    req.flash('success', 'New Review was successfully created!')
    res.redirect(`/destination/${req.params.id}`);
}))

router.delete('/:reviewID', isLoggedIn, isAuthorforReview, catchasy((async function (req, res){
    await Dest.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewID}})
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash('success', 'Destination was deleted successfully!')
    res.redirect(`/destination/${req.params.id}`);
})))


module.exports = router;