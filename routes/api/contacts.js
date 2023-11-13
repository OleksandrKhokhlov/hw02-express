const express = require("express");
const router = express.Router();
const { isValidId, validateBody } = require("../../middlewares");

const {
  contactSchema,
  updateFavoriteSchema,
} = require("../../shemas/contacts");

const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
  updateFavorite,
} = require("../../controllers/contacts");

router.get("/", getAll);

router.get("/:contactId", isValidId, getById);

router.post("/", validateBody(contactSchema), add);

router.delete("/:contactId", isValidId, deleteById);

router.put("/:contactId", isValidId, validateBody(contactSchema), updateById);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

module.exports = router;
