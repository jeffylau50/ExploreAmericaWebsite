const mongoose = require('mongoose');
const review = require('../model/reviews.js')
const Schema = mongoose.Schema;


const destSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageURL : {
        type: String,
        
    },
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews :[ 
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
]
});

destSchema.post('findOneAndDelete', async function (doc){
    if (doc){
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Dest = mongoose.model('Dest', destSchema);
module.exports = Dest;

