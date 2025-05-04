import { Router } from "express";
import { celebrate } from "celebrate";
import {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  unlikeCard,
} from "../controller/cards";
import {
  createCardValidationSchema,
  deleteCardValidationSchema,
} from "../controller/cards.validation";

const router = Router();

// GET /cards — возвращает все карточки
router.get("/", getCards);

// POST /cards — создаёт карточку
router.post("/", celebrate(createCardValidationSchema), createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete("/:id", celebrate(deleteCardValidationSchema), deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put("/:cardId/likes", likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete("/:cardId/likes", unlikeCard);

export default router;
