import { Router, Request, Response } from "express";
import DAO from "../../DAO";

const searchRoute = Router();

searchRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    const result = await DAO.userDAO.searchUser(keyword as string);
    if (result.length > 0) {
      return res.status(200).json(result);
    }

    return res.status(404).json({ message: "No any match" });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ message: "Invalid keyword" });
  }
});

export default searchRoute;
