"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@lib/supabaseBrowser";

export default function PollsPage() {
  const supabase = supabaseBrowser();
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("polls")
      .select(`
        id, title, starts_at, ends_at, is_active,
        poll_options (
          id, label,
          votes ( id )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error.message);
    } else {
      setPolls(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;
    const { error } = await supabase.from("polls").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchPolls();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Polls</h1>
      {loading ? (
        <p>Loading polls...</p>
      ) : polls.length === 0 ? (
        <p>No polls found</p>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => (
            <div key={poll.id} className="border p-4 rounded-lg bg-white shadow-sm">
              <h2 className="text-lg font-semibold">{poll.title}</h2>
              <p className="text-sm text-gray-500">
                {poll.starts_at} → {poll.ends_at}  
                {poll.is_active ? " (Active)" : " (Closed)"}
              </p>
              <ul className="mt-2 text-sm">
                {poll.poll_options.map((opt: any) => (
                  <li key={opt.id}>
                    {opt.label} — {opt.votes?.length || 0} votes
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleDelete(poll.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
                <a
                  href={`/admin/polls/${poll.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  View Stats
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
