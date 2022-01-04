import { model, Schema } from "mongoose";

const contactSchema: Schema = new Schema({
  id_user_requested: { type: String, required: true },
  id_user_requested_to: { type: String, required: true },
  is_accepted: { type: Boolean, default: false },
  removed_at: { type: Date, default: null },
  is_priority: { type: Boolean, default: true },
});

export default model("Contact", contactSchema);
