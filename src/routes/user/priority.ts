import { IPriorityJSON } from "./../../types/priority";
import DAO from "../../DAO";
import { Router, Request, Response } from "express";
import IUser from "../../types/user";

const priorityRoute = Router();

priorityRoute.get("/", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const priorities = await DAO.priorityDAO.getAllPriorities(email);

      if (priorities) {
        const prioritiesJSON: IPriorityJSON[] = [];
        for (const priority of priorities) {
          const priorityJSON = await DAO.priorityDAO.toJSON(priority);
          if (priorityJSON) {
            prioritiesJSON.push(priorityJSON);
          }
        }

        return res.status(200).json(prioritiesJSON);
      }
      return res.status(400).json({ message: "No priorities found" });
    }

    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

priorityRoute.post("/add", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user = await DAO.userDAO.getUserByEmail(email);
    const userPriorityID = req.body.user_priority_id as string;
    if (user && userPriorityID) {
      const priority = await DAO.priorityDAO.addPriority(user.email, userPriorityID);

      if (priority) {
        const priorityJSON = await DAO.priorityDAO.toJSON(priority);
        return res.status(200).json(priorityJSON);
      }
      return res.status(400).json({ message: "Error adding priority" });
    }

    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(401).json({ message: "Unauthorized" });
});

priorityRoute.post("/remove", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user = await DAO.userDAO.getUserByEmail(email);
    const prioritID = req.body.id_priority as string;
    if (user && prioritID) {
      const priority = await DAO.priorityDAO.removePriority(prioritID);

      if (priority) {
        const priorityJSON = await DAO.priorityDAO.toJSON(priority);
        return res.status(200).json(priorityJSON);
      }
      return res.status(400).json({ message: "Error removing priority" });
    } else if (user) {
      return res.status(400).json({ message: "Priority id is not supported" });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  return res.status(401).json({ message: "Unauthorized" });
});

export default priorityRoute;
