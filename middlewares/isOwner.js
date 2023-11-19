const { HttpError } = require("../helpers");
const Contact = require("../models/contact");

const isOwner = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (contact && contact.owner.toString() === req.user._id) {
    next();
  }
  next(HttpError(404, "Not Found"));
};

module.exports = isOwner;
