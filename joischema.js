const joi = require('joi')

const destinationSchema = joi.object({
    Dest: joi.object({
        name: joi.string().required(),
        price: joi.number().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        imageURL: joi.string().required()
    })
})