"use client";
import { useState, useEffect } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [tenantSlug, setTenantSlug] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email);      // show logged-in email
      setTenantSlug(payload.tenantSlug);
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else {
        setTitle(""); setContent(""); setError("");
        fetchNotes();
      }
    } catch (err) { console.error(err); }
  };

  // update a note
  const handleUpdate = async (id, title, content) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/notes?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else fetchNotes();
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Logged-in user */}
      <div className="mb-4 text-white-600 ">
        Logged in as <strong>{userEmail}</strong>
      </div>

      {/* Upgrade button */}
      {upgradeVisible && (
        <button
          onClick={handleUpgrade}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Upgrade to Pro
        </button>
      )}

      {/* Create note form */}
      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Create Note
        </button>
      </form>
      {/* Error message */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Notes list */}
      <ul className="mb-6">
        {notes.map((note) => (
          <li key={note._id} className="border p-2 mb-2 flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={note.title}
                onChange={(e) =>
                  setNotes((prev) =>
                    prev.map((n) => (n._id === note._id ? { ...n, title: e.target.value } : n))
                  )
                }
                className="font-bold border-b mb-1"
              />
              <input
                type="text"
                value={note.content}
                onChange={(e) =>
                  setNotes((prev) =>
                    prev.map((n) => (n._id === note._id ? { ...n, content: e.target.value } : n))
                  )
                }
                className="border-b"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(note._id, note.title, note.content)}
                className="bg-gray-500 text-white px-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
