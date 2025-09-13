import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "member"] },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
