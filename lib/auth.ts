import { randomBytes } from "crypto";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const resolvedSecret = (() => {
  const explicitSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (explicitSecret?.trim()) return explicitSecret.trim();

  // Generate a deterministic-but-unique secret per runtime to avoid crashes on Vercel
  const globalSymbol = Symbol.for("__app_nextauth_secret");
  const globalWithSecret = globalThis as typeof globalThis & Record<symbol, string>;

  if (!globalWithSecret[globalSymbol]) {
    globalWithSecret[globalSymbol] = randomBytes(32).toString("hex");
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[auth] NEXTAUTH_SECRET missing; using runtime-generated secret. Set NEXTAUTH_SECRET to avoid session resets."
      );
    }
  }

  return globalWithSecret[globalSymbol];
})();

// Minimal credentials provider restricted to a single user.
export const authOptions: NextAuthOptions = {
  secret: resolvedSecret,
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

