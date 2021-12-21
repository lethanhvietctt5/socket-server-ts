import { IUserJSON } from "./user";
import { Document, ObjectId } from "mongoose";

export default interface IGroup extends Document {
  _id: ObjectId;
  name: string;
  created_at: Date;
  is_deleted: boolean;
}

export interface IGroupJSON {
  _id: string;
  name: string;
  created_at: Date;
  is_deleted: boolean;
  joined_at: Date | null;
  left_at: Date | null;
  user_added: IUserJSON;
  is_admin: boolean;
}
