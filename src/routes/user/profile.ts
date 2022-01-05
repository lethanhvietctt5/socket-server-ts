import { IUserJSON } from "./../../types/user";
import { Router, Request, Response } from "express";
import DAO from "../../DAO";
import IUser from "../../types/user";

const profileRoute = Router();

profileRoute.get("/", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const userJSON: IUserJSON | null = await DAO.userDAO.toJSON(user);
      if (userJSON) {
        return res.status(200).json(userJSON);
      }
    }
    return res.status(400).json({ message: "No user found" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

profileRoute.post("/edit", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: "Missing parameters, name and password is required." });
    }
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const updatedUser = await DAO.userDAO.updateUser(user.id, name, password);
      const userJSON: IUserJSON | null = await DAO.userDAO.toJSON(updatedUser);
      if (userJSON) {
        return res.status(200).json({ message: "User updated successfully", user: userJSON });
      } else {
        return res.status(400).json({ message: "Update failed." });
      }
    }
    return res.status(400).json({ message: "No user found" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

export default profileRoute;
