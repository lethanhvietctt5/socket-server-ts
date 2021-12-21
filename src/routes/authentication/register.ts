import DAO from "../../DAO";
import { Router, Request, Response } from "express";

const registerRoute = Router();

registerRoute.post("/", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const existUser = await DAO.userDAO.getUserByEmail(email);

  if (existUser) {
    return res.status(400).json({ message: "Email already exist" });
  }

  const user = await DAO.userDAO.createUser(email, name, password);
  return res.status(200).json({ user });
});

export default registerRoute;
