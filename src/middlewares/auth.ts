import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import IAuthContext from "../types";
import AuthError from "../config/authError";

const authMiddleware: RequestHandler<
  unknown,
  { message: string },
  unknown,
  unknown,
  IAuthContext
> = (req, res, next) => {
  try {
    const rawToken = req.headers.authorization;
    if (!rawToken || !rawToken.startsWith("Bearer ")) {
      throw new AuthError("Требуется авторизация");
    }
    const token = rawToken.replace("Bearer ", "");
    const tokenInfo = jwt.verify(token, process.env.JWT_SECRET || "fnsejnf");
    res.locals.currentUser = tokenInfo as IAuthContext["currentUser"];
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
