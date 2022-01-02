import { IBlockJSON } from "./../../types/block";
import { Router, Request, Response } from "express";
import IUser from "../../types/user";
import DAO from "../../DAO";

const blokckRoute = Router();

blokckRoute.get("/", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const blocks = await DAO.blockDAO.getAllBlocks(email);
      if (blocks) {
        const blocksJSON: IBlockJSON[] = [];
        for (const block of blocks) {
          const blockJSON = await DAO.blockDAO.toJSON(block);
          if (blockJSON) {
            blocksJSON.push(blockJSON);
          }
        }
        return res.status(200).json(blocksJSON);
      }
      return res.status(400).json({ message: "No blocks found" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

blokckRoute.post("/add", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user = await DAO.userDAO.getUserByEmail(email);
    const userBlockedID = req.body.user_blocked_id as string;
    if (user && userBlockedID) {
      const block = await DAO.blockDAO.addBlock(user.email, userBlockedID);
      if (block) {
        const blockJSON = await DAO.blockDAO.toJSON(block);
        return res.status(200).json(blockJSON);
      }
      return res.status(400).json({ message: "Error adding block" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

blokckRoute.post("/remove", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user = await DAO.userDAO.getUserByEmail(email);
    const blockID = req.body.id_block as string;
    if (user && blockID) {
      const block = await DAO.blockDAO.removeBlock(blockID);
      if (block) {
        const blockJSON = await DAO.blockDAO.toJSON(block);
        return res.status(200).json(blockJSON);
      }
      return res.status(400).json({ message: "Error removing block" });
    } else if (user) {
      return res.status(400).json({ message: "Block id is not supported" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

export default blokckRoute;
