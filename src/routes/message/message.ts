import IMessage, { IMainMessageJSON } from "./../../types/message";
import { Router, Request, Response } from "express";
import DAO from "../../DAO";
import IUser from "../../types/user";
import IMessageGroup from "../../types/message_group";

const messageRoute = Router();

messageRoute.get("/", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);

    if (user) {
      const mainMessages: IMainMessageJSON[] = await DAO.messageDAO.getMainMessage(user.id);
      return res.status(200).json(mainMessages);
    }
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
      const invidualMessages: IMessage[] = await DAO.messageDAO.getInvidualMessage(user.id, id_user_contact);
      let result: IMainMessageJSON[] = [];
      for (const message of invidualMessages) {
        const convertJSON = await DAO.messageDAO.toJSON(message);
        if (convertJSON) {
          result.push(convertJSON);
        }
      }
      return res.status(200).json(result);
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
      if (invidualMessages) {
        const result: IMainMessageJSON | null = await DAO.messageDAO.toJSON(invidualMessages);
        return res.status(200).json(result);
      }
      return res.status(400).json({ message: "Error" });
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
      const result: IMainMessageJSON[] = [];
      for (let message of groupMessages) {
        const convertJSON = await DAO.messageDAO.toJSON(message);
        if (convertJSON) {
          result.push(convertJSON);
        }
      }
      return res.status(200).json(result);
    }
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
      const groupMessage: IMessageGroup | null = await DAO.messageDAO.addGroupMessage(id_group, user.id, content);
      if (groupMessage) {
        const result: IMainMessageJSON | null = await DAO.messageDAO.toJSON(groupMessage);
        return res.status(200).json(result);
      }
      return res.status(400).json({ message: "Can not give back result" });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

export default messageRoute;
