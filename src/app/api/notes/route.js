import { dbConnect } from "@/lib/dbConnect";
import Note from "@/models/Note";
import Tenant from "@/models/Tenant";
import { authenticate } from "@/lib/auth";

export async function GET(req) {
  await dbConnect();
  try {
    const user = authenticate(req); // { userId, tenantId, role }

    const notes = await Note.find({ tenantId: user.tenantId });
    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 401 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const user = authenticate(req);

    // Check subscription limit
    const tenant = await Tenant.findById(user.tenantId);
    if (tenant.plan === "free") {
      const count = await Note.countDocuments({ tenantId: user.tenantId });
      if (count >= 3) {
        return new Response(
          JSON.stringify({ error: "Free plan limit reached. Upgrade to Pro." }),
          { status: 403 }
        );
      }
    }

    const { title, content } = await req.json();
    const note = await Note.create({
      title,
      content,
      tenantId: user.tenantId,
      authorId: user.userId,
    });

    return new Response(JSON.stringify(note), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect();
  try {
    const user = authenticate(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { title, content } = await req.json();

    const note = await Note.findOne({ _id: id, tenantId: user.tenantId });
    if (!note) {
      return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });
    }

    note.title = title;
    note.content = content;
    await note.save();

    return new Response(JSON.stringify(note), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  try {
    const user = authenticate(req);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const note = await Note.findOneAndDelete({ _id: id, tenantId: user.tenantId });
    if (!note) {
      return new Response(JSON.stringify({ error: "Note not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Note deleted" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
