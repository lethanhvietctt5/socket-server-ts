import bcrypt from "bcrypt";
import { IUserJSON } from "./../../types/user";
import jwt from "jsonwebtoken";
import DAO from "../../DAO";
import { Router, Request, Response } from "express";
import Token from "../../types/token";
import IUser from "../../types/user";

const loginRoute = Router();

loginRoute.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: IUser | null = await DAO.userDAO.getUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password." });
  }

  const check = await bcrypt.compare(password, user.password);

  if (check) {
    const token: Token = {
      email: user.email,
      expriredAt: Date.now() + 7 * 60 * 60 * 24 * 1000,
    };
    const tokenString = jwt.sign(token, "secret");
    const userJSON: IUserJSON | null = await DAO.userDAO.toJSON(user);
    if (userJSON) {
      return res.status(200).json({ access_token: tokenString, user: userJSON });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

export default loginRoute;
