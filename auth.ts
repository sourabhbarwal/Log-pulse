import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "LogPulse Account",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ email: credentials.email, provider: "credentials" });
        if (!user) return null;

        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!isMatch) return null;

        return { id: user._id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name || user.email?.split("@")[0] || "User",
              email: user.email,
              image: user.image,
              provider: account.provider,
              role: "ADMIN"
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Prevent sign in on DB error
        }
      }
      return true;
    },
  },
});
