const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string()
    .pattern(/[A-Z][a-z]* [A-Z][a-z]*/)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/\(\d{3}\) \d{3}-\d{4}/)
    .required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { contactSchema, updateFavoriteSchema };
