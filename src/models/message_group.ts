import { model, Schema } from "mongoose";

const messageGroupSchema: Schema = new Schema({
  id_sender: { type: String, required: true },
  id_group: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  sent_at: { type: Date, default: Date.now, required: true },
  is_removed: { type: Boolean, default: false, required: true },
});

export default model("MessageGroup", messageGroupSchema);
