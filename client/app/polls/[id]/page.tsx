"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseBrowser } from "@lib/supabaseBrowser";

export default function PollVotingPage() {
  const supabase = supabaseBrowser();
  const { id } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Fetch poll + options
  const fetchPollData = async (pollId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("polls")
      .select(`
        id, title, description, starts_at, ends_at, is_active,
        poll_options ( id, label )
      `)
      .eq("id", pollId)
      .single();

    if (!error) setPoll(data);
    setLoading(false);
  };

  // Submit vote
  const submitVote = async () => {
    if (!selectedOption || !poll) return;
    setSubmitting(true);

    const { error } = await supabase.from("votes").insert({
      poll_id: poll.id,
      option_id: selectedOption,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    });

    if (error) {
      if (error.message.includes("duplicate")) {
        alert("You have already voted on this poll.");
      } else {
        alert("Error submitting vote: " + error.message);
      }
    } else {
      alert("Vote submitted successfully!");
    }

    setSubmitting(false);
  };

  useEffect(() => {
    if (id) fetchPollData(id as string);
  }, [id]);

  if (loading) return <p>Loading poll...</p>;
  if (!poll) return <p>Poll not found</p>;

  const isActive =
    new Date(poll.starts_at) <= new Date() &&
    new Date() <= new Date(poll.ends_at) &&
    poll.is_active;

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded-lg bg-white shadow">
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="text-gray-600 mb-4">{poll.description || "No description"}</p>
      <p className="text-sm text-gray-500 mb-4">
        {poll.starts_at} → {poll.ends_at} {isActive ? "(Active)" : "(Closed)"}
      </p>

      {isActive ? (
        <>
          <h2 className="text-lg font-semibold mb-2">Choose an Option</h2>
          <ul className="mb-4">
            {poll.poll_options.map((option: any) => (
              <li key={option.id} className="mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="poll_option"
                    value={option.id}
                    onChange={() => setSelectedOption(option.id)}
                  />
                  {option.label}
                </label>
              </li>
            ))}
          </ul>

          <button
            onClick={submitVote}
            disabled={!selectedOption || submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>
        </>
      ) : (
        <p className="text-red-500 font-semibold">This poll is closed.</p>
      )}
    </div>
  );
}
