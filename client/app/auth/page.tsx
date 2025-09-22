"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Insert user profile after signup
        if (data.user) {
          const wait = await supabase.rpc("create_profile", {
          uid: data.user.id,
          username: email.split("@")[0],
          display_name: email.split("@")[0]
        });
          console.log(wait)
        }
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Alx Voting System</h1>

        {/* Toggle Login / Signup */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 ${mode === "login" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 ${mode === "signup" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
          >
            Signup
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Signup"}
        </button>
      </div>
    </div>
  );
}
