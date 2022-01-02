import { IGroupJSON } from "./../../types/group";
import { Router, Request, Response } from "express";
import DAO from "../../DAO";
import IGroup from "../../types/group";
import IUser from "../../types/user";
import IGroupMember from "../../types/group_member";

const groupRoute = Router();

groupRoute.get("/", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const groups: IGroup[] = await DAO.groupDAO.getAllGroups(user._id.valueOf().toString());
      if (groups) {
        let groupsJSON: IGroupJSON[] = [];
        for (const group of groups) {
          const groupMember = await DAO.groupDAO.getYourDetails(user._id.valueOf().toString(), group._id.valueOf().toString());
          if (groupMember) {
            const groupJSON: IGroupJSON | null = await DAO.groupDAO.toJSON(groupMember);
            if (groupJSON) {
              groupsJSON.push(groupJSON);
            }
          }
        }
        return res.status(200).json(groupsJSON);
      }
      return res.status(400).json({ message: "Can not get Group infomation." });
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

groupRoute.post("/create", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const group_name = req.body.group_name as string;
    if (user) {
      if (group_name) {
        const group: IGroup | null = await DAO.groupDAO.createGroup(group_name, user._id.valueOf().toString());
        if (group) {
          const groupMember = await DAO.groupDAO.getYourDetails(user._id.valueOf().toString(), group._id.valueOf().toString());
          if (groupMember) {
            const groupJSON: IGroupJSON | null = await DAO.groupDAO.toJSON(groupMember);
            if (groupJSON) {
              return res.status(200).json(groupJSON);
            }
          }
        }
        return res.status(400).json({ message: "Cannot create group" });
      }
    }
  }
  return res.status(401).json({ message: "Unauthorized" });
});

groupRoute.post("/add", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const userAdded: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const id_group = req.body.id_group as string;
    const id_new_user = req.body.id_new_user as string;
    const newMember = await DAO.userDAO.getUserById(id_new_user);
    const group = await DAO.groupDAO.getGroupById(id_group);
    if (newMember && group && userAdded) {
      const groupInfo: IGroup | null = await DAO.groupDAO.addNewMember(newMember.id, group.id, userAdded.id);

      if (groupInfo) {
        const groupMember = await DAO.groupDAO.getYourDetails(newMember._id.valueOf().toString(), group._id.valueOf().toString());
        if (groupMember) {
          const groupJSON: IGroupJSON | null = await DAO.groupDAO.toJSON(groupMember);
          if (groupJSON) {
            return res.status(200).json(groupJSON);
          }
        }
      }
    }
    return res.status(400).json({ message: "Cannot add member to group" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

groupRoute.post("/leave", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const id_group = req.body.id_group as string;
    const group = await DAO.groupDAO.getGroupById(id_group);
    if (user && group) {
      const groupMember: IGroupMember | null = await DAO.groupDAO.leaveGroup(user._id.valueOf().toString(), group._id.valueOf().toString());

      if (groupMember) {
        const groupJSON: IGroupJSON | null = await DAO.groupDAO.toJSON(groupMember);
        if (groupJSON) {
          return res.status(200).json(groupJSON);
        }
      }
    }
    return res.status(400).json({ message: "Cannot leave group" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

groupRoute.get("/members", async (req: Request, res: Response) => {
  if (res.locals.user_email) {
    const email = res.locals.user_email as string;
    const user: IUser | null = await DAO.userDAO.getUserByEmail(email);
    const id_group = req.query.id_group as string;
    const group = await DAO.groupDAO.getGroupById(id_group);
    if (user && group) {
      const members = await DAO.groupDAO.getAllMembersOfGroup(id_group);
      if (members) {
        return res.status(200).json(members);
      }
    }
    return res.status(400).json({ message: "Can not get group members" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

export default groupRoute;
