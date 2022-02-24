const mongoose = require('mongoose');

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
    }
})


const Dest = mongoose.model('Dest', destSchema)
module.exports = Dest;

