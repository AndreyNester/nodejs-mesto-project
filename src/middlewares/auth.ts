import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import IAuthContext from "../types";

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
      res.status(401).send({
        message: "Ошибка авторизации",
      });
      return;
    }
    const token = rawToken.replace("Bearer ", "");
    const tokenInfo = jwt.verify(token, "!I_lova_my_job");
    res.locals.currentUser = tokenInfo as IAuthContext["currentUser"];
    next();
  } catch (err) {
    res.status(401).send({ message: "Ошибка авторизации" });
  }
};

export default authMiddleware;
