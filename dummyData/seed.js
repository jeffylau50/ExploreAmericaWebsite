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

let picArray17 = ['https://source.unsplash.com/collection/190727/',
'https://source.unsplash.com/collection/483251/',                                                                                                      
'https://source.unsplash.com/collection/1114848/',
'https://source.unsplash.com/collection/3403106/',
'https://source.unsplash.com/collection/1667713/',
'https://source.unsplash.com/collection/3155144/',
'https://source.unsplash.com/collection/2063295/',
'https://source.unsplash.com/collection/8469893/',
'https://source.unsplash.com/collection/219941/',
'https://source.unsplash.com/collection/3178572/',
'https://source.unsplash.com/collection/235549/',
'https://source.unsplash.com/collection/4994801/',
'https://source.unsplash.com/collection/162468/',
'https://source.unsplash.com/collection/2203755/',
'https://source.unsplash.com/collection/311028/',
'https://source.unsplash.com/collection/362271/',
'https://source.unsplash.com/collection/1254524/']




const seed = async () => {
    await Dest.deleteMany({})
    for (i = 0; i < 50; i++) {
        Dest.insertMany([{ name: descriptors[randomNum(descriptors.length)] + " " + places[randomNum(places.length)], price: randomNum(500), 
        description: ' Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate libero aliquam velit hic, eum fugiat illum aliquid error dolorum quis consequatur mollitia sit explicabo minima, minus earum officia corrupti harum non facere, enim tempora odio labore fugit? Corporis quis officia qui ut porro sequi quos voluptatum facere inventore sapiente? Dignissimos!', 
        location : city[i].city + ', ' + city[i].state, imageURL : picArray17[randomNum(17)], author: '6226edb967ddba61ec268c82'}])
    }
}

seed()