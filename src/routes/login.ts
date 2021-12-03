import jwt from "jsonwebtoken";
import userDA from "../DA/userDA";
import { Router, Request, Response } from "express";
import Token from "../types/token";

const loginRoute = Router();

loginRoute.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userDA.getUserByEmail(email);

  if (user && user.password === password) {
    const token: Token = {
      email: user.email,
      expriredAt: new Date().getTime() + 7 * 60 * 60 * 24,
    };
    const tokenString = jwt.sign(token, "secret", { expiresIn: "1h" });
    return res.status(200).json({ access_token: tokenString });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

export default loginRoute;
