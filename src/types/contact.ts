import { IUserJSON } from "./user";
import { Document, ObjectId } from "mongoose";

export default interface IContact extends Document {
  _id: ObjectId;
  id_user_requested: ObjectId;
  id_user_requested_to: ObjectId;
  is_accepted: boolean;
  removed_at: Date | null;
  is_priority: boolean;
}

// Need to be implemented at client side
export interface IContactJSON {
  _id: string;
  user_requested: IUserJSON;
  user_requested_to: IUserJSON;
  is_accepted: boolean;
  removed_at: Date | null;
  is_priority: boolean;
}
