const express = require("express");
const { isValidId, validateBody, authenticate } = require("../../middlewares");
const {
  contactSchema,
  updateFavoriteSchema,
} = require("../../shemas/contacts");

const router = express.Router();

const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts");
const isOwner = require("../../middlewares/isOwner");

router.get("/", authenticate, getAll);

router.get("/:contactId", authenticate, isValidId, isOwner, getById);

router.post("/", authenticate, validateBody(contactSchema), add);

router.delete("/:contactId", authenticate, isValidId, isOwner, deleteById);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(contactSchema),
  isOwner,
  updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  isOwner,
  updateFavorite
);

module.exports = router;
