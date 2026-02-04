import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [GitHub, Google],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "ADMIN";
        token.id = user.id;
        token.name = user.name || user.email?.split("@")[0] || "User";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
