"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import Button from "@/components/Button";
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
      setTimeout(async () => {
        const session = await getSession();

        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.name || "",
            email: session.user.email || "",
            role: session.user.role || "user",
          });

          if (session.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/shop");
          }
        } else {
          setError("Failed to load session. Please try again.");
        }
      }, 200);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-accent text-cherry">
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
          className="w-full p-2 mb-4 border focus:outline-cherry border-cherry rounded font-body"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 mb-4 border focus:outline-cherry border-cherry rounded font-body"
        />

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <div className="flex items-center justify-center">
          <Button type="submit">Login</Button>
        </div>

        <p className="text-sm mt-4 text-center font-body">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="hover:font-bold underline">
            Sign up
          </a>
        </p>
      </form>
    </main>
  );
}
