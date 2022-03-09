const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewText: {
        type: String
        
    },
    rating: {
        type: Number
    }
})


module.exports = mongoose.model('Review', reviewSchema)


