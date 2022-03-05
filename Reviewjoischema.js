const joi = require('joi')

const reviewSchema = joi.object({
    Review: joi.object({
        reviewText: joi.string().required(),
        rating: joi.number().required()
        
    })
}).unknown()

module.exports = reviewSchema;