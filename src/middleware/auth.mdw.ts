import DAO from "../DAO";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Token from "../types/token";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const access_token: string | undefined = req.headers["x-auth-token"]?.toString();

  if (typeof access_token === "undefined") {
    return res.status(401).json({ message: "Missing access_token" });
  }

  if (access_token.length === 0) {
    return res.status(401).json({ message: "access_token is empty." });
  }

  try {
    const decode = jwt.verify(access_token, "secret");
    const { email, expriredAt } = decode as Token;

    if (expriredAt < Date.now()) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    const user = await DAO.userDAO.getUserByEmail(email);

    if (user === null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.locals.user_email = email;

    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid access_token" });
  }
}
