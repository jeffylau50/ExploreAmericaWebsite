const mongoose = require('mongoose');
const review = require('../model/reviews.js')
const Schema = mongoose.Schema;

const opts = {toJSON: { virtuals: true}};

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

    geometry: {
        type:{
        type: String,
        enum: ['Point'],
        }, 
        coordinates: {
            type: [Number],
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

}, opts);

destSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/destination/${this._id}">${this.name}</a>`
})

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

