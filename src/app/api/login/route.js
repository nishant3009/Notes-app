import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import Tenant from "@/models/Tenant"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
    }

    //  Find tenant to get slug
    const tenant = await Tenant.findById(user.tenantId);

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        tenantId: tenant._id,
        tenantSlug: tenant.slug, 
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
