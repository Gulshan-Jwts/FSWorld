import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const runtime = "nodejs"; 
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectMongo();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = await User.create({
            email: user.email,
          });
        }

        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    }, // ✅ Include user data in JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    // ✅ Expose session data to frontend
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt", // 👈 important
  },
  async redirect({ url, baseUrl }) {
    return baseUrl;
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
