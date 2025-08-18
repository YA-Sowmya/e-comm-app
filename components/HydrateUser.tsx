"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function HydrateUser({ user }: { user: any }) {
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null; // just hydration
}
