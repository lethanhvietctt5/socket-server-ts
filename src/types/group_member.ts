import { Document, ObjectId } from "mongoose";

export default interface IGroupMember extends Document {
  _id: ObjectId;
  id_group: string;
  id_member: string;
  joined_at: Date;
  left_at: Date | null;
  id_user_added: string;
  is_admin: boolean;
}
