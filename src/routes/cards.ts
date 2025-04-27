import { Router } from "express";
import { createCard, deleteCard, getCards } from "../controller/cards";

const router = Router();

// GET /cards — возвращает все карточки
router.get("/cards", getCards);

// POST /cards — создаёт карточку
router.post("/cards", createCard);

// DELETE /cards/:cardId — удаляет карточку по идентификатору
router.delete("/cards/:id", deleteCard);

export default router;
