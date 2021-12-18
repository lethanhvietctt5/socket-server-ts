import { Document, ObjectId } from "mongoose";

export default interface IUser extends Document {
  _id: ObjectId;
  email: string;
  name: string;
  password: string;
  image_url: string;
  created_at: Date;
}
