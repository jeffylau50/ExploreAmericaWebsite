const mongoose = require('mongoose');
const review = require('../model/reviews.js')
const Schema = mongoose.Schema;


const destSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },

    geoPoint: {
        type:{
        type: String,
        enum: ['Point'],
        required: true
        }, 
        coordinates: {
            type: [Number],
            required: true
        }
    },

    image : [{
        URL: String, fileName: String
    }],
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

