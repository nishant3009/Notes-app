import jwt from "jsonwebtoken";

export function authenticate(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { userId, tenantId, role }
  } catch (err) {
    throw new Error("Invalid token");
  }
}
