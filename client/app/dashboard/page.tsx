"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@lib/supabaseBrowser";

export default function UserDashboard() {
  const supabase = supabaseBrowser();
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's votes with poll & option details
  const fetchVotes = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("votes")
      .select(`
        id, created_at,
        polls:poll_id ( id, title, starts_at, ends_at ),
        poll_options:option_id ( id, label )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setVotes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading your votes...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">My Voting History</h1>

      {votes.length === 0 ? (
        <p className="text-gray-500">You haven’t voted on any polls yet.</p>
      ) : (
        <ul className="space-y-3">
          {votes.map((vote) => (
            <li key={vote.id} className="border rounded p-4 hover:shadow">
              <h2 className="text-lg font-semibold">{vote.polls.title}</h2>
              <p className="text-sm text-gray-600 mb-1">
                You voted for: <span className="font-semibold">{vote.poll_options.label}</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {new Date(vote.created_at).toLocaleString()}
              </p>
              <Link
                href={`/admin/polls/${vote.polls.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Poll Results →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
