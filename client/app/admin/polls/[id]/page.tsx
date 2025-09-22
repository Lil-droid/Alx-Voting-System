"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseBrowser } from "@lib/supabaseBrowser";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PollAnalytics() {
  const supabase = supabaseBrowser();
  const { id } = useParams();
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch poll data
  const fetchPollData = async (pollId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("polls")
      .select(`
        id, title, description, starts_at, ends_at, is_active,
        poll_options (
          id, label,
          votes ( id )
        )
      `)
      .eq("id", pollId)
      .single();

    if (!error) setPoll(data);
    setLoading(false);
  };

  // Subscribe to real-time votes
  const subscribeToVotes = (pollId: string) => {
    const channel = supabase
      .channel(`realtime-poll-${pollId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "votes",
          filter: `poll_id=eq.${pollId}`,
        },
        () => {
          // Fetch fresh data whenever a new vote is added
          fetchPollData(pollId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  useEffect(() => {
    if (id) {
      fetchPollData(id as string);
      return subscribeToVotes(id as string);
    }
  }, [id]);

  if (loading) return <p>Loading poll data...</p>;
  if (!poll) return <p>Poll not found</p>;

  // Prepare chart data
  const chartData = poll.poll_options.map((opt: any) => ({
    name: opt.label,
    votes: opt.votes?.length || 0,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-lg bg-white shadow">
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="text-gray-600 mb-4">{poll.description || "No description"}</p>
      <p className="text-sm text-gray-500 mb-4">
        {poll.starts_at} → {poll.ends_at} {poll.is_active ? "(Active)" : "(Closed)"}
      </p>

      <h2 className="text-lg font-semibold mb-2">Votes Breakdown (Live)</h2>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="votes"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 text-sm">
        {chartData.map((opt: any, i: number) => (
          <li key={i} className="flex justify-between border-b py-1">
            <span>{opt.name}</span>
            <span>{opt.votes} votes</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
