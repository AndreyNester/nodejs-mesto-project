import { Router } from "express";
import { createCard, deleteCard, getCards } from "../controller/cards";

const router = Router();

// GET /cards — возвращает все карточки
router.get("/cards", getCards);

// POST /cards — создаёт карточку
router.post("/cards", createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete("/cards/:id", deleteCard);

// PUT /cards/:cardId/likes — поставить лайк карточке
router.put("/cards/:cardId/likes");

// DELETE /cards/:cardId/likes — убрать лайк с карточки
router.delete("/cards/:cardId/likes");

export default router;
