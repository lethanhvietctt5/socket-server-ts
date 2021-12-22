import { Router, Request, Response } from "express";
import DAO from "../../DAO";
import IUser from "../../types/user";

const messageRoute = Router();

messageRoute.get("/", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);

    if (user) {
      const maimMessages = await DAO.messageDAO.getMainMessage(user._id.valueOf().toString());
      return res.status(200).json(maimMessages);
    }

    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

messageRoute.get("/invidual", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const id_user_contact = req.query.id_user_contact as string;
    if (!id_user_contact) {
      return res.status(400).json({ message: "Missing id_user_contact" });
    }
    if (user) {
      const invidualMessages = await DAO.messageDAO.getInvidualMessage(user._id.valueOf().toString(), id_user_contact);
      return res.status(200).json(invidualMessages);
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
});
messageRoute.post("/invidual/add", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const content = req.body.content as string;
    const id_user_contact = req.body.id_user_contact as string;
    if (!content) {
      return res.status(400).json({ message: "Missing content" });
    }

    if (!id_user_contact) {
      return res.status(400).json({ message: "Missing id_user_contact" });
    }

    if (user) {
      const invidualMessages = await DAO.messageDAO.addInvidualMessage(user._id.valueOf().toString(), id_user_contact, content);
      return res.status(200).json(invidualMessages);
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
});

messageRoute.get("/group", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const id_group = req.query.id_group as string;
    if (!id_group) {
      return res.status(400).json({ message: "Missing id_group" });
    }
    if (user) {
      const groupMessages = await DAO.messageDAO.getGroupMessage(id_group);
      return res.status(200).json(groupMessages);
    }

    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});
messageRoute.post("/group/add", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const content = req.body.content as string;
    const id_group = req.body.id_group as string;
    if (!content) {
      return res.status(400).json({ message: "Missing content" });
    }

    if (!id_group) {
      return res.status(400).json({ message: "Missing id_contact" });
    }

    if (user) {
      const groupMessage = await DAO.messageDAO.addGroupMessage(id_group, user.id, content);
      return res.status(200).json(groupMessage);
    }

    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

export default messageRoute;
