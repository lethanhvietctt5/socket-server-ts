import { model, Schema } from "mongoose";

const groupMemberSchema: Schema = new Schema({
  id_group: { type: String, required: true },
  id_member: { type: String, required: true },
  joined_at: { type: Date, default: Date.now },
  left_at: { type: Date, default: null },
  id_user_added: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
});

export default model("GroupMember", groupMemberSchema);
