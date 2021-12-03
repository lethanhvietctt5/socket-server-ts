import userDA from "../DA/userDA";
import { Router, Request, Response } from "express";

const registerRoute = Router();

registerRoute.post("/", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existUser = await userDA.getUserByEmail(email);

  if (existUser) {
    return res.status(400).json({ message: "Email already exist" });
  }

  const user = await userDA.createUser(email, password, name);
  return res.status(200).send({ user });
});

export default registerRoute;
