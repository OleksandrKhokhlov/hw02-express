const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const nameField = error.message.split(" ");
      
      next(HttpError(400, `missing required ${nameField[0]} field`));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
