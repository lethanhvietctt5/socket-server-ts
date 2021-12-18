import { model, Schema } from "mongoose";

const groupMemberSchema: Schema = new Schema({
  id_group: { type: String, required: true },
  id_member: { type: String, required: true },
  joined_at: { type: Date, default: Date.now, required: true },
  left_at: { type: Date, default: null, required: true },
  id_user_added: { type: String, required: true },
  is_admin: { type: Boolean, default: false, required: true },
});

export default model("GroupMember", groupMemberSchema);
