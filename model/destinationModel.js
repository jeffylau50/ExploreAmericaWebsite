const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/exploreamerica')
.then(() => {
    console.log('DB connection open')
})
.catch(err => {
    console.log(err)
})

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
    reviews :[ 
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
]
});


const Dest = mongoose.model('Dest', destSchema)
module.exports = Dest;

