"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [tenantSlug, setTenantSlug] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // fetch notes for tenant
  const fetchNotes = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);

      // show upgrade button if Free tenant with 3 notes
      setUpgradeVisible(data.length >= 3);
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   if (token) {
  //     const payload = JSON.parse(atob(token.split(".")[1]));
  //     setUserEmail(payload.email);      // show logged-in email
  //     setTenantSlug(payload.tenantSlug);
  //   }
  //   fetchNotes();
  // }, [token]);

  useEffect(() => {
    if (!token) {
      router.push("/login"); // 🚀 redirect if not logged in
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email);
      setTenantSlug(payload.tenantSlug);
    } catch (err) {
      console.error("Invalid token");
      router.push("/login");
    }

    fetchNotes();
  }, [token]);

  // create a note
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else {
        setTitle("");
        setContent("");
        setError("");
        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // update a note
  const handleUpdate = async (id, title, content) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/notes?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // delete a note
  const handleDelete = async (id) => {
    if (!token) return;
    try {
      await fetch(`/api/notes?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // upgrade Free to pro
  const handleUpgrade = async () => {
    if (!token || !tenantSlug) return;
    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/upgrade`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Tenant upgraded to Pro! You can now create unlimited notes.");
        fetchNotes();
      } else alert(data.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-neutral-400">
            Logged in as{" "}
            <strong className="text-neutral-200">{userEmail}</strong>
          </div>

          {upgradeVisible && (
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center justify-center
                          h-11 px-4 rounded-lg font-medium tracking-wide
                          border border-neutral-800
                          bg-neutral-900/80 text-white
                          transition-all duration-200
                          hover:border-[#D4AF37]
                          hover:shadow-[0_10px_30px_-12px_rgba(212,175,55,0.5)]
                          active:scale-[0.98]
                          focus:outline-none focus:ring-4 focus:ring-white/20"
              title="Upgrade to Pro"
            >
              <span className="relative z-10">Upgrade to Pro</span>
            </button>
          )}
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-8 rounded-xl border border-neutral-800 bg-neutral-950/80 backdrop-blur p-5
                     shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
        >
          <h2 className="mb-4 text-lg font-medium text-neutral-200">
            Create note
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 rounded-lg bg-neutral-900/80 text-white placeholder-neutral-500 px-3
                         border border-neutral-800
                         focus:outline-none focus:border-neutral-200 focus:ring-4 focus:ring-white/5
                         transition-colors"
              required
              aria-label="Title"
            />
            <input
              type="text"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-11 rounded-lg bg-neutral-900/80 text-white placeholder-neutral-500 px-3
                         border border-neutral-800
                         focus:outline-none focus:border-neutral-200 focus:ring-4 focus:ring-white/5
                         transition-colors"
              required
              aria-label="Content"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full h-11 rounded-lg bg-white text-black font-medium tracking-wide
                       transition-all duration-200
                       hover:bg-neutral-200 hover:shadow-[0_8px_20px_-8px_rgba(255,255,255,0.5)]
                       active:scale-[0.98] active:bg-neutral-300
                       focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            Create Note
          </button>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </form>

        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note._id}
              className="group rounded-xl border border-neutral-800 bg-neutral-950/80 backdrop-blur p-4
                         transition-all duration-200
                         hover:border-neutral-700 hover:shadow-[0_8px_24px_-12px_rgba(255,255,255,0.06)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={note.title}
                    onChange={(e) =>
                      setNotes((prev) =>
                        prev.map((n) =>
                          n._id === note._id
                            ? { ...n, title: e.target.value }
                            : n
                        )
                      )
                    }
                    className="w-full bg-transparent text-white font-semibold tracking-tight
                               border-b border-neutral-800 focus:border-neutral-300
                               focus:outline-none focus:ring-0"
                    aria-label="Note title"
                  />
                  <input
                    type="text"
                    value={note.content}
                    onChange={(e) =>
                      setNotes((prev) =>
                        prev.map((n) =>
                          n._id === note._id
                            ? { ...n, content: e.target.value }
                            : n
                        )
                      )
                    }
                    className="w-full bg-transparent text-neutral-300
                               border-b border-neutral-800 focus:border-neutral-300
                               focus:outline-none focus:ring-0"
                    aria-label="Note content"
                  />
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() =>
                      handleUpdate(note._id, note.title, note.content)
                    }
                    className="rounded-md bg-neutral-800 text-white px-3 h-9 text-sm
                               transition-all duration-200
                               hover:bg-neutral-700 hover:shadow-[0_6px_18px_-8px_rgba(255,255,255,0.2)]
                               active:scale-[0.98]
                               focus:outline-none focus:ring-4 focus:ring-white/10"
                    title="Save"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="rounded-md bg-red-600 text-white px-3 h-9 text-sm
                               transition-all duration-200
                               hover:bg-red-500 hover:shadow-[0_6px_18px_-8px_rgba(255,255,255,0.2)]
                               active:scale-[0.98]
                               focus:outline-none focus:ring-4 focus:ring-red-500/30"
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {notes.length === 0 && (
          <p className="mt-8 text-center text-sm text-neutral-500">
            No notes yet. Create the first one.
          </p>
        )}
      </div>
    </div>
  );
}
