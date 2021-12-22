import { IUserJSON } from "./user";
import { IGroupJSON } from "./group";
import { Document, ObjectId } from "mongoose";

export default interface IMessageGroup extends Document {
  _id: ObjectId;
  id_group: string;
  id_sender: string;
  content: string;
  type: string;
  sent_at: Date;
  is_removed: boolean;
}

export interface IMessageGroupJSON {
  _id: string;
  group: IGroupJSON;
  sender: IUserJSON;
  content: string;
  type: string;
  sent_at: Date;
  is_removed: boolean;
}
