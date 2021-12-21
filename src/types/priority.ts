import { IUserJSON } from "./user";
import { Document, ObjectId } from "mongoose";

export default interface IPriority extends Document {
  _id: ObjectId;
  id_user: string;
  id_user_priority: string;
  added_at: Date;
  is_removed: boolean;
  updated_at: Date;
}

export interface IPriorityJSON {
  _id: string;
  user: IUserJSON;
  user_priority: IUserJSON;
  added_at: Date;
  is_removed: boolean;
  updated_at: Date;
}
