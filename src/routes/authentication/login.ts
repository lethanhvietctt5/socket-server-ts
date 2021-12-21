import jwt from "jsonwebtoken";
import DAO from "../../DAO";
import { Router, Request, Response } from "express";
import Token from "../../types/token";

const loginRoute = Router();

loginRoute.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await DAO.userDAO.getUserByEmail(email);

  if (user && user.password === password) {
    const token: Token = {
      email: user.email,
      expriredAt: Date.now() + 7 * 60 * 60 * 24 * 1000,
    };
    const tokenString = jwt.sign(token, "secret");
    return res.status(200).json({ access_token: tokenString });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

export default loginRoute;
