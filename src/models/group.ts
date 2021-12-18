import { model, Schema } from "mongoose";

const groupSchema: Schema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now, required: true },
  is_deleted: { type: Boolean, default: false, required: true },
});

export default model("Group", groupSchema);
