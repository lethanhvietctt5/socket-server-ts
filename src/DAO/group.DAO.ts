import { IUserJSON } from "./../types/user";
import { IGroupJSON } from "./../types/group";
import GroupModel from "../models/group";
import GroupMemberModel from "../models/group_member";
import UserModel from "../models/user";
import IGroup from "../types/group";
import IGroupMember from "../types/group_member";
import IUser from "../types/user";
import DAO from "./";

export class GroupDAO {
  constructor() {}

  public getGroupById = async (id: string): Promise<IGroup | null> => {
    const result = await GroupModel.findById(id);
    return result;
  };

  public getAllGroups = async (id_user: string): Promise<IGroup[]> => {
    const groupsJoined: IGroupMember[] = await GroupMemberModel.find({ id_member: id_user });
    if (groupsJoined.length > 0) {
      const result: IGroup[] = [];
      for (const group of groupsJoined) {
        const groupInfo: IGroup = await GroupModel.findById(group.id_group);
        if (groupInfo && group.left_at == null) {
          result.push(groupInfo);
        }
      }
      return result;
    }
    return [];
  };

  public addNewMember = async (id_user: string, id_group: string, id_user_added: string): Promise<IGroup | null> => {
    const group: IGroup | null = await GroupModel.findById(id_group);
    if (group) {
      let groupMember: IGroupMember | null = await GroupMemberModel.findOne({ id_group, id_member: id_user });
      if (groupMember) {
        groupMember.left_at = null;
        groupMember.joined_at = new Date(Date.now());
        groupMember.id_user_added = id_user_added;
        groupMember = await groupMember.save();
      } else {
        groupMember = new GroupMemberModel({
          id_group,
          id_member: id_user,
          id_user_added,
        }) as IGroupMember;
        await groupMember.save();
      }
      return group;
    }
    return null;
  };

  public leaveGroup = async (id_user: string, id_group: string): Promise<IGroupMember | null> => {
    const group: IGroup | null = await GroupModel.findById(id_group);
    if (group) {
      const groupMember: IGroupMember | null = await GroupMemberModel.findOne({ id_group, id_member: id_user });
      if (groupMember) {
        groupMember.left_at = new Date(Date.now());
        await groupMember.save();
        return groupMember;
      }
    }
    return null;
  };

  public createGroup = async (name: string, id_user: string): Promise<IGroup | null> => {
    const admin = await DAO.userDAO.getUserById(id_user);
    if (admin && name.length > 0) {
      const group: IGroup = new GroupModel({
        name,
        created_at: new Date(Date.now()),
        is_deleted: false,
      });
      await group.save();

      const groupMember: IGroupMember = new GroupMemberModel({
        id_group: group._id,
        id_member: id_user,
        joined_at: new Date(Date.now()),
        left_at: null,
        id_user_added: id_user,
        is_admin: true,
      });
      await groupMember.save();
      return group;
    }
    return null;
  };

  public getYourDetails = async (id_user: string, id_group: string): Promise<IGroupMember | null> => {
    const groupMember: IGroupMember | null = await GroupMemberModel.findOne({ id_group, id_member: id_user });
    if (groupMember) {
      return groupMember;
    }
    return null;
  };

  public getAllMembersOfGroup = async (id_group: string): Promise<IUserJSON[] | null> => {
    const group: IGroup | null = await this.getGroupById(id_group);
    if (group) {
      const groupMembers: IGroupMember[] = await GroupMemberModel.find({ id_group });
      if (groupMembers.length > 0) {
        const members: IUser[] = await UserModel.find({ _id: { $in: groupMembers.map((member) => member.id_member) } });
        const membersJSON: IUserJSON[] = await Promise.all(
          members.map(async (member): Promise<IUserJSON> => {
            const JSON = (await DAO.userDAO.toJSON(member)) as IUserJSON;
            return JSON;
          })
        );
        return membersJSON;
      }
    }
    return null;
  };

  public changePriority = async (id_user: string, id_group: string): Promise<IGroupMember | null> => {
    const groupMember: IGroupMember | null = await GroupMemberModel.findOne({ id_group, id_member: id_user });
    if (groupMember) {
      groupMember.is_priority = !groupMember.is_priority;
      await groupMember.save();
      return groupMember;
    }
    return null;
  };

  public toJSON = async (groupMember: IGroupMember | null): Promise<IGroupJSON | null> => {
    if (groupMember) {
      const group: IGroup | null = await GroupModel.findById(groupMember.id_group);
      const user_added: IUser | null = await DAO.userDAO.getUserById(groupMember.id_user_added);
      if (user_added && group) {
        const userAddedJSON: IUserJSON | null = await DAO.userDAO.toJSON(user_added);
        if (userAddedJSON) {
          const result: IGroupJSON = {
            _id: group._id.valueOf().toString(),
            name: group.name,
            created_at: group.created_at,
            is_deleted: group.is_deleted,
            joined_at: groupMember.joined_at,
            left_at: groupMember.left_at,
            user_added: userAddedJSON,
            is_admin: groupMember.is_admin,
            is_priority: groupMember.is_priority,
          };
          return result;
        }
      }
    }
    return null;
  };
}

const groupDAO = new GroupDAO();

export default groupDAO;
