import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  name: String,
  plan: { type: String, default: "free" },
});

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);
