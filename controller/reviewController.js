const Dest = require('../model/destinationModel.js');
const Review = require('../model/reviews.js');

module.exports.review = async function (req, res){
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
};

module.exports.deleteReview = async function (req, res){
    await Dest.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewID}})
    await Review.findByIdAndDelete(req.params.reviewID);
    req.flash('success', 'Destination was deleted successfully!')
    res.redirect(`/destination/${req.params.id}`);
};