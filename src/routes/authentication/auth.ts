import jwt from "jsonwebtoken";
import DAO from "../../DAO";
import { Router, Request, Response } from "express";
import Token from "../../types/token";

const authRoute = Router();

authRoute.post("/", async (req: Request, res: Response) => {
  const access_token: string | undefined = req.headers["x-auth-token"]?.toString();

  if (typeof access_token === "undefined") {
    return res.status(401).json({ message: "Missing access_token" });
  }

  if (access_token.length === 0) {
    return res.status(401).json({ message: "access_token is empty." });
  }

  try {
    const decode = await jwt.verify(access_token, "secret");
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

    const userJSON = await DAO.userDAO.toJSON(user);

    return res.status(200).json({
      message: "Authenticated",
      user: userJSON,
    });
  } catch (e) {
    return res.status(401).json({ message: "Invalid access_token" });
  }
});

export default authRoute;
