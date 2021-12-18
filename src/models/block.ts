import { model, Schema } from "mongoose";

const blockSchema: Schema = new Schema({
  id_user: { type: String, required: true },
  id_user_blocked: { type: String, required: true },
  blocked_at: { type: Date, default: Date.now },
  is_removed: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now },
});

export default model("Block", blockSchema);
