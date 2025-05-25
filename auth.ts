import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/prismaDB";
import authConfig from "./auth.config";

import { getSubUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/accounts";

export const config = {
  pages: { signIn: "/auth/login", error: "/auth/error" },

  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getSubUserById(user.id!);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactor = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactor) return false;
        await db.twoFactorConfirmation.delete({ where: { id: twoFactor.id } });
      }
      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getSubUserById(token.sub);
      if (!user) return token;

      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;
      return token;
    },
  },

  adapter: PrismaAdapter(db, { modelMapping: { User: "subUser" } }),
  session: { strategy: "jwt" },
  trustHost: true, // permite exponer signIn/signOut helpers
  ...authConfig,
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth(config);
