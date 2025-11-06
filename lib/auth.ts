import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Minimal credentials provider restricted to a single user.
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || undefined,
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

        // Restrict to a single allowed user
        const ALLOWED_EMAIL = "reese@the-official-app.com";
        const ALLOWED_PASSWORD = "Reese510";

        if (email !== ALLOWED_EMAIL || password !== ALLOWED_PASSWORD) {
          return null;
        }

        const name = "Reese";
        const role = "ADMIN";
        return { id: email, name, email, role } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // @ts-ignore augment token with role
        token.role = (user as any).role ?? token.role ?? "USER";
      }
      return token;
    },
    async session({ session, token }: any) {
      // @ts-ignore include role on session
      session.user = { ...session.user, role: (token as any).role ?? "USER" } as any;
      return session;
    },
  },
};

export async function getSessionServer() {
  return getServerSession(authOptions);
}


