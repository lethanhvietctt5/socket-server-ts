import { IGroupJSON } from "./group";
import { IUserJSON } from "./user";
import { Document, ObjectId } from "mongoose";

export default interface IMessage extends Document {
  _id: ObjectId;
  id_sender: string;
  id_receiver: string;
  content: string;
  type: string;
  sent_at: Date;
  is_removed: boolean;
}

export interface IMessageJSON {
  _id: string;
  sender: IUserJSON;
  receiver: IUserJSON;
  content: string;
  type: string;
  sent_at: Date;
  is_removed: boolean;
}

export interface IMainMessageJSON {
  _id: ObjectId;
  sender: IUserJSON;
  receiver: IUserJSON | null;
  group: IGroupJSON | null;
  content: string;
  type: string;
  sent_at: Date;
  is_removed: boolean;
}
