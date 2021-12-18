import { model, Schema } from "mongoose";

const groupSchema: Schema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
});

export default model("Group", groupSchema);
