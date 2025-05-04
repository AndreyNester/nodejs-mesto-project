import { Router } from "express";
import {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  unlikeCard,
} from "../controller/cards";

const router = Router();

// GET /cards — возвращает все карточки
router.get("/", getCards);

// POST /cards — создаёт карточку
router.post("/", createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete("/:id", deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put("/:cardId/likes", likeCard);

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete("/:cardId/likes", unlikeCard);

export default router;
