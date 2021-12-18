import { model, Schema } from "mongoose";

const prioritySchema: Schema = new Schema({
  id_user: { type: String, required: true },
  id_user_priority: { type: String, required: true },
  added_at: { type: Date, default: Date.now },
  is_removed: { type: Boolean, default: false },
  updated_at: { type: Date, default: Date.now },
});

export default model("Priority", prioritySchema);
