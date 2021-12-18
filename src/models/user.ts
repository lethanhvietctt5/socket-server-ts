import { model, Schema } from "mongoose";

const userSchema: Schema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  image_url: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

export default model("User", userSchema);
