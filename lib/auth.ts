import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createHash } from "crypto";
import { sql } from "@/lib/db";

// Guard: Log warning if secret is missing but don't crash at import time
if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  console.warn(
    "[auth] NEXTAUTH_SECRET is missing. Set this environment variable in production to ensure secure sessions."
  );
}

// Database-backed credentials provider that allows any registered user to login.
// Note: trustHost is automatically handled in NextAuth v4 when NEXTAUTH_URL is set
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");
        if (!email || !password) return null;

        try {
          // Check database for user
          const { rows } = await sql<{
            id: string;
            name: string;
            email: string;
            password: string | null;
            role: string | null;
          }>`
            select id, name, email, password, role 
            from users 
            where email = ${email} 
            limit 1
          `;

          if (rows.length === 0) {
            return null;
          }

          const user = rows[0];

          // Hash the provided password and compare with stored hash
          const hashedPassword = createHash("sha256")
            .update(password)
            .digest("hex");

          if (!user.password || user.password !== hashedPassword) {
            return null;
          }

          return {
            id: user.id,
            name: user.name || email.split("@")[0],
            email: user.email,
            role: user.role || "USER",
          } as any;
        } catch (error) {
          console.error("[auth] authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // @ts-ignore augment token with role and id
        token.role = (user as any).role ?? token.role ?? "USER";
        token.id = (user as any).id ?? token.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      // @ts-ignore include role and id on session
      session.user = { 
        ...session.user, 
        role: (token as any).role ?? "USER",
        id: (token as any).id ?? null,
      } as any;
      return session;
    },
  },
};

export async function getSessionServer() {
  return getServerSession(authOptions);
}

