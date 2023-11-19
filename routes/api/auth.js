const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { userSchema, updateSubscriptionShema } = require("../../shemas/users");
const {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
} = require("../../controllers/auth");

const router = express.Router();

router.post("/register", validateBody(userSchema), register);

router.post("/login", validateBody(userSchema), login);

router.get("/current", authenticate, getCurrent);

router.post("/logout", authenticate, logout);

router.patch(
  "/",
  authenticate,
  validateBody(updateSubscriptionShema),
  updateSubscription
);

module.exports = router;
