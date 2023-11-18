const Joi = require("joi");

const userSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string(),
});

module.exports = {
  userSchema,
};
