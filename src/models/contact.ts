import { model, Schema } from "mongoose";

const contactSchema: Schema = new Schema({
  id_user_requested: { type: String, required: true },
  id_user_requested_to: { type: String, required: true },
  is_accepted: { type: Boolean, default: false, required: true },
  removed_at: { type: Date, default: null, required: true },
});

export default model("Contact", contactSchema);
