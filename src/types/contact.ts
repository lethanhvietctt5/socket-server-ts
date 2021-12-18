import { Document, ObjectId } from "mongoose";

export default interface IContact extends Document {
  _id: ObjectId;
  id_user_requested: string;
  id_user_requested_to: string;
  is_accepted: boolean;
  removed_at: Date | null;
}
