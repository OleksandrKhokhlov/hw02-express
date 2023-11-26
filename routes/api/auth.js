const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const {
  userSchema,
  updateSubscriptionShema,
  emailSchema,
} = require("../../shemas/users");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(userSchema), register);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(emailSchema), resendVerifyEmail);

router.post("/login", validateBody(userSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionShema),
  updateSubscription
);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

module.exports = router;
