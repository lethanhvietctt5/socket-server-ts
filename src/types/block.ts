import { IUserJSON } from "./user";
import { Document, ObjectId } from "mongoose";

export default interface IBlock extends Document {
  _id: ObjectId;
  id_user: string;
  id_user_blocked: string;
  blocked_at: Date;
  is_removed: boolean;
  updated_at: Date;
}

export interface IBlockJSON {
  _id: string;
  user: IUserJSON;
  user_blocked: IUserJSON;
  blocked_at: Date;
  is_removed: boolean;
  updated_at: Date;
}
