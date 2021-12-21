import { IBlockJSON } from "./../types/block";
import IBlock from "../types/block";
import BlockModel from "../models/block";
import DAO from ".";
import IUser from "../types/user";

export class BlockDAO {
  constructor() {}

  public getBlockById = async (id_block: string): Promise<IBlock | null> => {
    const block: IBlock | null = await BlockModel.findById(id_block);
    return block;
  };

  public getAllBlocks = async (email: string): Promise<IBlock[]> => {
    const user = await DAO.userDAO.getUserByEmail(email);
    if (user) {
      const blocks: IBlock[] = await BlockModel.find({
        $or: [{ id_user_blocked: user._id }, { id_user_blocked_to: user._id }],
      });
      return blocks;
    }
    return [];
  };

  public addBlock = async (userEmail: string, userBlockedID: string): Promise<IBlock | null> => {
    const user: IUser | null = await DAO.userDAO.getUserByEmail(userEmail);
    const userBlocked: IUser | null = await DAO.userDAO.getUserById(userBlockedID);
    if (user && userBlocked) {
      const block = await BlockModel.find({
        $and: [{ id_user: user._id }, { id_user_blocked: userBlocked._id }],
      });

      if (block.length === 0) {
        const newBlock = await new BlockModel({
          id_user: user._id,
          id_user_blocked: userBlocked._id,
          added_at: new Date(Date.now()),
          is_removed: false,
          updated_at: new Date(Date.now()),
        }).save();

        return newBlock;
      } else if (block[0].is_removed) {
        block[0].is_removed = false;
        block[0].updated_at = new Date(Date.now());

        await block[0].save();
        return block[0];
      }

      return null;
    }
    return null;
  };

  public removeBlock = async (id_block: string): Promise<IBlock | null> => {
    const block: IBlock | null = await this.getBlockById(id_block);

    if (block) {
      block.is_removed = true;
      block.updated_at = new Date(Date.now());

      await block.save();
      return block;
    }

    return null;
  };

  public toJSON = async (block: IBlock): Promise<IBlockJSON | null> => {
    const user = await DAO.userDAO.getUserById(block.id_user);
    const userJSON = await DAO.userDAO.toJSON(user);
    const userBlocked = await DAO.userDAO.getUserById(block.id_user_blocked);
    const userBlockedJSON = await DAO.userDAO.toJSON(userBlocked);

    if (userJSON && userBlockedJSON) {
      let result: IBlockJSON = {
        _id: block._id.valueOf().toString(),
        user: userJSON,
        user_blocked: userBlockedJSON,
        blocked_at: block.blocked_at,
        is_removed: block.is_removed,
        updated_at: block.updated_at,
      };

      return result;
    }

    return null;
  };
}

const blockDAO = new BlockDAO();

export default blockDAO;
