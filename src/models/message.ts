import { model, Schema } from "mongoose";

const messageSchema: Schema = new Schema({
  id_sender: { type: String, required: true },
  id_receiver: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true },
  sent_at: { type: Date, default: Date.now },
  is_removed: { type: Boolean, default: false },
  is_notification: { type: Boolean, default: false },
});

export default model("Message", messageSchema);
