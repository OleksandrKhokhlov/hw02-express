const { HttpError } = require("../helpers");
const Contact = require("../models/contact");

const getAll = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    // const result = await Contact.find({ owner }, {}, { skip, limit });
    const result = await Contact.find({&or:{owner},{favorite:true} }, {}, { skip, limit });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
      next();
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const newContact = await Contact.create({ ...req.body, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
      next();
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    if (!req.body) {
      throw HttpError(400, "missing fields");
    }

    const { contactId } = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (contact) {
      res.status(200).json(contact);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    if (!req.body) {
      throw HttpError(400, "missing fields");
    }

    const { contactId } = req.params;
    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (contact) {
      res.status(200).json(contact);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
  updateFavorite,
};
