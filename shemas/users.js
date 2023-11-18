const Joi = require("joi");

const userSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
  token: Joi.string(),
});

const updateSubscriptionShema = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter")
    .required(),
});

module.exports = {
  userSchema,
  updateSubscriptionShema,
};
