import jwt from "jsonwebtoken";
import DAO from "../../DAO";
import { Router, Request, Response } from "express";
import Token from "../../types/token";

const authRoute = Router();

authRoute.post("/", async (req: Request, res: Response) => {
  const access_token: string | undefined = req.headers["x-auth-token"]?.toString();

  if (typeof access_token === "undefined") {
    return res.status(401).json({
      message: "No access token provided",
    });
  }

  const decode = jwt.verify(access_token, "secret");
  const { email, expriredAt } = decode as Token;

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

  return res.status(200).json({
    message: "Authenticated",
  });
});

export default authRoute;