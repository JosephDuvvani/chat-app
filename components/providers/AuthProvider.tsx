"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/app/generated/prisma";

const AuthContext = createContext<User | null>(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const [authUser, setAuthUser] = useState<User | null>(null);

  useEffect(() => {
    if (authUser) return;

    const fetchUser = async () => {
      if (user) setAuthUser(user);
    };
    fetchUser();

    return () => {
      setAuthUser(null);
    };
  }, []);

  return (
    <AuthContext.Provider value={authUser}>{children}</AuthContext.Provider>
  );
}
