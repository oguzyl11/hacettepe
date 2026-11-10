import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { isHacettepeEmail } from "@/lib/utils";
import { getPrisma } from "@/lib/prisma";

const prisma = getPrisma();
const googleReady = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);
const emailReady = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);

export const authProviders = {
  google: googleReady,
  email: emailReady,
  database: Boolean(prisma),
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  session: { strategy: prisma ? "database" : "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  providers: [
    ...(googleReady
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
              params: {
                hd: "hacettepe.edu.tr",
                prompt: "select_account",
              },
            },
          }),
        ]
      : []),
    ...(emailReady
      ? [
          Nodemailer({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const profileEmail =
        profile && "email" in profile && typeof profile.email === "string"
          ? profile.email
          : null;
      return isHacettepeEmail(user.email ?? profileEmail);
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ?? token?.sub ?? "";
      }
      return session;
    },
  },
});
