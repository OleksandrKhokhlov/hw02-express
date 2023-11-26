const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("node:path");
const Jimp = require("jimp");
const fs = require("node:fs/promises");
const { nanoid } = require("nanoid");

const User = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");
const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "..", "public", "avatars");

const register = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const { subscription } = await User.create({
      ...req.body,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target=_blank href='${BASE_URL}/users/verify/${verificationToken}'>Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({ user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      next(HttpError(404, "User not found"));
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      next(HttpError(401, "Email not found"));
    }

    if (user.verify) {
      next(HttpError(400, "Verification has already been passed"));
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target=_blank href='${BASE_URL}/users/verify/${user.verificationToken}'>Click verify email</a>`,
    };

    await sendEmail(verifyEmail);
    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user.verify) {
      next(HttpError(401, "Email not verified"));
    }

    if (!user) {
      next(HttpError(401, "Email or password is wrong"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    const { subscription } = user;
    res.status(200).json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

const getCurrent = (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
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
      next(HttpError(400, "missing fields"));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription },
      {
        new: true,
      }
    );

    if (user) {
      res.status(200).json(user);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!req.file) {
      next(HttpError(400, "missing fields"));
    }
    const { path: tmpUpload, originalname } = req.file;

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);

    const avatar = await Jimp.read(tmpUpload);
    await avatar
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .rotate(-90)
      .writeAsync(tmpUpload);

    await fs.rename(tmpUpload, resultUpload);

    const avatarURL = path.join("avatars", filename);

    await User.findByIdAndUpdate(_id, { ...req.user, avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  resendVerifyEmail,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
};
