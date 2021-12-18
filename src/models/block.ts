import { model, Schema } from "mongoose";

const blockSchema: Schema = new Schema({
  id_user: { type: String, required: true },
  id_user_blocked: { type: String, required: true },
  blocked_at: { type: Date, default: Date.now, required: true },
  is_removed: { type: Boolean, default: false, required: true },
  updated_at: { type: Date, default: Date.now, required: true },
});

export default model("Block", blockSchema);
