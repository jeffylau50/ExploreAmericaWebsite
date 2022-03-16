const Basejoi = require('joi')
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML:{
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});


const joi = Basejoi.extend(extension)

const destinationSchema = joi.object({
    Dest: joi.object({
        name: joi.string().required().escapeHTML(),
        price: joi.number().required(),
        description: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        imageURL: joi.string().escapeHTML()
    })
}).unknown()

module.exports = destinationSchema;