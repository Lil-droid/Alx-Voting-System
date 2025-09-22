"use client";
import { useState } from "react";
import { supabaseBrowser } from "@lib/supabaseBrowser";

export default function CreatePoll() {
  const supabase = supabaseBrowser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddOption = () => setOptions([...options, ""]);

  const handleChangeOption = (i: number, value: string) => {
    const newOptions = [...options];
    newOptions[i] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async () => {
    if (!title || options.some((o) => !o) || !start || !end) {
      alert("Please fill out all fields");
      return;
    }

    setLoading(true);

    // Step 1: Insert into polls
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title,
        description,
        starts_at: start,
        ends_at: end,
        is_active: true,
      })
      .select("id")
      .single();

    if (pollError || !poll) {
      alert(pollError?.message || "Error creating poll");
      setLoading(false);
      return;
    }

    // Step 2: Insert options linked to the poll
    const optionsData = options.map((label, i) => ({
      poll_id: poll.id,
      label,
      position: i + 1,
    }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsData);

    if (optionsError) {
      alert(optionsError.message);
    } else {
      alert("Poll created successfully!");
      setTitle("");
      setDescription("");
      setOptions(["", ""]);
      setStart("");
      setEnd("");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Create a New Poll</h1>
      <input
        className="border p-2 mb-2 block w-full"
        placeholder="Poll Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 mb-2 block w-full"
        placeholder="Poll Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border p-2 mb-2 block w-full"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="datetime-local"
        className="border p-2 mb-2 block w-full"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          className="border p-2 mb-2 block w-full"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => handleChangeOption(i, e.target.value)}
        />
      ))}
      <button onClick={handleAddOption} className="bg-gray-200 p-2 mr-2">Add Option</button>
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2" disabled={loading}>
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </div>
  );
}
