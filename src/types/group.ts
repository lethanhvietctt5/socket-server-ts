import { Document, ObjectId } from "mongoose";

export default interface IGroup extends Document {
  _id: ObjectId;
  name: string;
  created_at: Date;
  is_deleted: boolean;
}
