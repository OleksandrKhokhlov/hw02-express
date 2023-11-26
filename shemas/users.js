const Joi = require("joi");

const userSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string(),
});

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const updateSubscriptionShema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .required(),
});

module.exports = {
  userSchema,
  emailSchema,
  updateSubscriptionShema,
};
