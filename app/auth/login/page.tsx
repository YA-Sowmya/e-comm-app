"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      // Delay for session cookie to be available
      setTimeout(async () => {
        const session = await getSession();

        if (session?.user) {
          // Store user in Zustand
          setUser({
            id: session.user.id,
            name: session.user.name || "",
            email: session.user.email || "",
            role: session.user.role || "user",
          });

          // Redirect based on role
          if (session.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/"); // User dashboard or homepage
          }
        } else {
          setError("Failed to load session. Please try again.");
        }
      }, 200); // Delay helps ensure session cookie is ready
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-heading text-center mb-4">Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 mb-4 border rounded font-body"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 mb-4 border rounded font-body"
        />

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-cherryRed text-white p-2 rounded hover:bg-red-700 transition">
          Login
        </button>

        <p className="text-sm mt-4 text-center font-body">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-cherryPink underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
