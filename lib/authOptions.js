// lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const authOptions = {
  providers: [
    // Email + Password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Invalid email or password");
        if (!user.emailVerified) throw new Error("Please verify your email");

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isMatch) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.imageUrl || null,
          username: user.username,
          imagePublicId: user.imagePublicId || null,
        };
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      httpOptions: {
        timeout: 10000,
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            _id: Date.now().toString(),
            name: user.name,
            email: user.email,
            username: user.email.split("@")[0],
            emailVerified: true,
            role: "user",
          });
        }
      }
      return true;
    },

    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //     token.role = user.role;
    //     token.image = user.image || null;
    //     token.username = user.username;
    //     token.imagePublicId = user.imagePublicId || null;
    //   } else {
    //     await connectDB();
    //     const dbUser = await User.findById(token.id).lean();
    //     if (dbUser) {
    //       token.role = dbUser.role;
    //       token.image = dbUser.imageUrl || null;
    //       token.username = dbUser.username;
    //       token.imagePublicId = dbUser.imagePublicId || null;
    //       token.accessToken = jwt.sign({ id: user.id }, process.env.NEXTAUTH_SECRET);
    //     }
    //   }
    //   return token;
    // },
    async jwt({ token, user }) {
      if (user) {
        // When the user logs in for the first time
        token.id = user.id;
        token.role = user.role;
        token.image = user.image || null;
        token.username = user.username;
        token.imagePublicId = user.imagePublicId || null;
        token.accessToken = jwt.sign({ id: user.id }, process.env.NEXTAUTH_SECRET);
      } else {
        // For existing sessions
        await connectDB();
        const dbUser = await User.findById(token.id).lean();
        if (dbUser) {
          token.role = dbUser.role;
          token.image = dbUser.imageUrl || null;
          token.username = dbUser.username;
          token.imagePublicId = dbUser.imagePublicId || null;
        }
      }
      return token;
    },

    // async session({ session, token }) {
    //   if (token) {
    //     session.user.id = token.id;
    //     session.user.role = token.role;
    //     session.user.image = token.image;
    //     session.user.username = token.username;
    //     session.user.imagePublicId = token.imagePublicId;
    //     session.accessToken = token.accessToken;
    //   }
    //   return session;
    // },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.username = token.username;
        session.user.imagePublicId = token.imagePublicId;
        session.accessToken = token.accessToken || null;
      }
      return session;
    },
  },
};
