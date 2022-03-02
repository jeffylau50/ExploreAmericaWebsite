const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exploreamerica')
.then(() => {
    console.log('DB connection open')
})
.catch(err => {
    console.log(err)
})

const reviewSchema = new mongoose.Schema({
    reviewText: {
        type: String
        
    },
    rating: {
        type: Number
    }
})


module.exports = mongoose.model('Review', reviewSchema)


