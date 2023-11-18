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

router.get("/",authenticate, getAll);

router.get("/:contactId", authenticate, isValidId, getById);

router.post("/", authenticate, validateBody(contactSchema), add);

router.delete("/:contactId", authenticate, isValidId, deleteById);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(contactSchema),
  updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

module.exports = router;
