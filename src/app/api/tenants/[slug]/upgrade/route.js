import { dbConnect } from "@/lib/dbConnect";
import Tenant from "@/models/Tenant";
import { authenticate } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const user = authenticate(req); // { userId, tenantId, role }

    // only Admin can upgrade
    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Only Admin can upgrade subscription" }),
        { status: 403 }
      );
    }

    const { slug } = params;

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return new Response(JSON.stringify({ error: "Tenant not found" }), { status: 404 });
    }

    // check if user belongs to this tenant
    if (tenant._id.toString() !== user.tenantId) {
      return new Response(
        JSON.stringify({ error: "You cannot upgrade another tenant" }),
        { status: 403 }
      );
    }

    tenant.plan = "pro";
    await tenant.save();

    return new Response(JSON.stringify({ message: "Tenant upgraded to Pro successfully" }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
