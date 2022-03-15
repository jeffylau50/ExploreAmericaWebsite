const mongoose = require('mongoose');
const review = require('../model/reviews.js');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
        
    },
    isAdmin: {
        type: Boolean
    }
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
