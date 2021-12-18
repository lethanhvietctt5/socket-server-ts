import { Document, ObjectId } from "mongoose";

export default interface IPriority extends Document {
  _id: ObjectId;
  id_user: string;
  id_user_priority: string;
  added_at: Date;
  is_removed: boolean;
  updated_at: Date;
}
