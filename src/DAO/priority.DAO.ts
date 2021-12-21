import { IPriorityJSON } from "../types/priority";
import DAO from ".";
import IUser from "../types/user";
import PriorityModel from "../models/priority";
import IPriority from "../types/priority";

export class PriorityDAO {
  constructor() {}
  public getAllPriorities = async (userEmail: string): Promise<IPriority[] | null> => {
    const user: IUser | null = await DAO.userDAO.getUserByEmail(userEmail);

    if (user) {
      const priorities = await PriorityModel.find({ id_user: user._id });
      return priorities;
    }

    return null;
  };

  public getPriorityById = async (priorityId: string): Promise<IPriority | null> => {
    const priority = await PriorityModel.findById(priorityId);
    return priority;
  };

  public addPriority = async (userEmail: string, userPriorityId: string): Promise<IPriority | null> => {
    const user: IUser | null = await DAO.userDAO.getUserByEmail(userEmail);
    const userPriority: IUser | null = await DAO.userDAO.getUserById(userPriorityId);

    if (user && userPriority) {
      const priority: IPriority[] = await PriorityModel.find({
        $and: [{ id_user: user._id }, { id_user_priority: userPriority._id }],
      });

      if (priority.length === 0) {
        const newPriority = await new PriorityModel({
          id_user: user._id,
          id_user_priority: userPriority._id,
          added_at: new Date(Date.now()),
          is_removed: false,
          updated_at: new Date(Date.now()),
        }).save();

        return newPriority;
      } else if (priority[0].is_removed) {
        priority[0].is_removed = false;
        priority[0].updated_at = new Date(Date.now());

        await priority[0].save();
        return priority[0];
      }

      return null;
    }

    return null;
  };

  public removePriority = async (priorityId: string): Promise<IPriority | null> => {
    const priority: IPriority | null = await PriorityModel.findById(priorityId);

    if (priority) {
      priority.is_removed = true;
      priority.updated_at = new Date(Date.now());

      await priority.save();
      return priority;
    }
    return null;
  };

  public toJSON = async (priority: IPriority): Promise<IPriorityJSON | null> => {
    const user = await DAO.userDAO.getUserById(priority.id_user);
    const userPriority = await DAO.userDAO.getUserById(priority.id_user_priority);
    const userJSON = await DAO.userDAO.toJSON(user);
    const userPriorityJSON = await DAO.userDAO.toJSON(userPriority);
    if (userJSON && userPriorityJSON) {
      let result: IPriorityJSON = {
        _id: priority._id.valueOf().toString(),
        user: userJSON,
        user_priority: userPriorityJSON,
        added_at: priority.added_at,
        is_removed: priority.is_removed,
        updated_at: priority.updated_at,
      };

      return result;
    }

    return null;
  };
}

const priorityDAO = new PriorityDAO();

export default priorityDAO;
