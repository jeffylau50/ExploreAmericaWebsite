const mongoose = require('mongoose');

const destSchema = new mongoose.Schema({
    name: {type : String,
        required: true
    },
    price: {
        type : Number,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    location: { type: String,
        required : true
    }
})

const Dest = mongoose.model('Dest', destSchema)
module.exports = Dest;
