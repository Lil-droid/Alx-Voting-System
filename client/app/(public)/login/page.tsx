"use client";

import { useState } from "react";
import { supabaseBrowser } from "@lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Login
  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard"); // ✅ redirect on success
    }
    setLoading(false);
  };

  // Handle Sign Up (no email verification)
  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: undefined }, // disables verification email
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard"); // ✅ redirect after signup success
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <input
        className="border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignIn}
        className="bg-blue-500 text-white p-2"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
      <button
        onClick={handleSignUp}
        className="bg-green-500 text-white p-2"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </div>
  );
}
