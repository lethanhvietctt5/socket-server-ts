import { Router, Request, Response } from "express";
import DAO from "../../DAO";

const searchRoute = Router();

searchRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    const result = await DAO.userDAO.searchUser(keyword as string);
    if (result.length > 0) {
      const resJson = await Promise.all(result.map((user) => DAO.userDAO.toJSON(user)));
      return res.status(200).json(resJson);
    }
    return res.status(404).json({ message: "No any match" });
  } catch (e) {
    return res.status(404).json({ message: "Invalid keyword" });
  }
});

export default searchRoute;
