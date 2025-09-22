"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@lib/supabaseBrowser";

export default function PollListingPage() {
  const supabase = supabaseBrowser();
  const [polls, setPolls] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch polls
  const fetchPolls = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("polls")
      .select("id, title, description, starts_at, ends_at, is_active")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPolls(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // Filter polls based on search
  const filteredPolls = polls.filter((poll) =>
    poll.title.toLowerCase().includes(search.toLowerCase()) ||
    (poll.description || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">Loading polls...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Available Polls</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search polls..."
        className="w-full border p-2 mb-4 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredPolls.length === 0 ? (
        <p className="text-gray-500">No polls found</p>
      ) : (
        <ul className="space-y-3">
          {filteredPolls.map((poll) => {
            const isActive =
              new Date(poll.starts_at) <= new Date() &&
              new Date() <= new Date(poll.ends_at) &&
              poll.is_active;

            return (
              <li key={poll.id} className="border rounded p-4 hover:shadow">
                <Link href={`/polls/${poll.id}`}>
                  <h2 className="text-lg font-semibold hover:underline">
                    {poll.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 mb-1">
                  {poll.description || "No description"}
                </p>
                <p className="text-xs text-gray-500">
                  {poll.starts_at} → {poll.ends_at} {isActive ? "(Active)" : "(Closed)"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
