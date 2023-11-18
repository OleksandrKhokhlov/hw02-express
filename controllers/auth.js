const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({ ...req.body, password: passwordHash });

    res.status(201).json({ user: { email, subscription: "starter" } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({ token, user: { email, subscription: "starter" } });
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res, next) => {
  res.json(`Authorization:${req.headers.authorization}`);
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204);
};

const updateSubscription = async (req, res, next) => {
  const { subscription } = req.body;
  try {
    if (!req.body) {
      throw HttpError(400, "missing fields");
    }

    const contact = await User.findByIdAndUpdate(
      req.user._id,
      { subscription },
      {
        new: true,
      }
    );

    if (contact) {
      res.status(200).json(contact);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
};
