import { dbConnect } from "@/lib/dbConnect";
import Tenant from "@/models/Tenant";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function GET() {
  await dbConnect();

  const pw = await bcrypt.hash("password", 10);

  const acme = await Tenant.findOneAndUpdate(
    { slug: "acme" },
    { slug: "acme", name: "Acme Inc", plan: "free" },
    { upsert: true, new: true }
  );

  const globex = await Tenant.findOneAndUpdate(
    { slug: "globex" },
    { slug: "globex", name: "Globex Corp", plan: "free" },
    { upsert: true, new: true }
  );

  await User.updateOne(
    { email: "admin@acme.test" },
    { email: "admin@acme.test", password: pw, role: "admin", tenantId: acme._id },
    { upsert: true }
  );
  await User.updateOne(
    { email: "user@acme.test" },
    { email: "user@acme.test", password: pw, role: "member", tenantId: acme._id },
    { upsert: true }
  );
  await User.updateOne(
    { email: "admin@globex.test" },
    { email: "admin@globex.test", password: pw, role: "admin", tenantId: globex._id },
    { upsert: true }
  );
  await User.updateOne(
    { email: "user@globex.test" },
    { email: "user@globex.test", password: pw, role: "member", tenantId: globex._id },
    { upsert: true }
  );

  return Response.json({ status: "ok", message: "Seeded successfully" });
}
