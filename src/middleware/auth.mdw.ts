import DAO from "../DAO";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Token from "../types/token";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const access_token: string | undefined = req.headers["x-auth-token"]?.toString();

  if (typeof access_token === "undefined") {
    return res.status(401).json({
      message: "No access token provided",
    });
  }

  const decode = jwt.verify(access_token, "secret");
  const { email, expriredAt } = decode as Token;

  console.log(new Date(Date.now()) + "-" + new Date(expriredAt));

  if (expriredAt < Date.now()) {
    return res.status(401).json({
      message: "Token expired",
    });
  }

  const user = await DAO.userDAO.getUserByEmail(email);

  if (user === null) {
    return res.status(200).json({
      message: "User not found",
    });
  }

  next();
}
