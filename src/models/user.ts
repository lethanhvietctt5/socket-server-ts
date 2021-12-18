import { model, Schema } from "mongoose";

const userSchema: Schema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  image_url: String,
  created_at: { type: Date, default: Date.now, required: true },
});

export default model("User", userSchema);
