// lib/authServer.ts
import { auth } from "@/auth"; // helper que exportas en auth.ts

export async function currentUser() {
  const session = await auth(); // Session | null
  return session?.user ?? null; // id, email, name, role, …
}

export async function currentRole() {
  const session = await auth();
  return session?.user?.role ?? null;
}
