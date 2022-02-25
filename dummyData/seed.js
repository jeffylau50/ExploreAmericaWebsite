const mongoose = require('mongoose');
const Dest = require('../model/destinationModel.js');
const city = require('./city.js');
const { places, descriptors } = require('./destNameCombo.js')


mongoose.connect('mongodb://localhost:27017/exploreamerica')
    .then(() => {
        console.log('DB connection open')
    })
    .catch(err => {
        console.log(err)
    })

function randomNum(num) {
    return Math.floor(Math.random() * num)
}


const seed = async () => {
    await Dest.deleteMany({})
    for (i = 0; i < 50; i++) {
        Dest.insertMany([{ name: descriptors[randomNum(descriptors.length)] + " " + places[randomNum(places.length)], price: randomNum(500), 
        description: ' Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate libero aliquam velit hic, eum fugiat illum aliquid error dolorum quis consequatur mollitia sit explicabo minima, minus earum officia corrupti harum non facere, enim tempora odio labore fugit? Corporis quis officia qui ut porro sequi quos voluptatum facere inventore sapiente? Dignissimos!', 
        location : city[i].city + ', ' + city[i].state}])
    }
}

seed()