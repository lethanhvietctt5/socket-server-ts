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
