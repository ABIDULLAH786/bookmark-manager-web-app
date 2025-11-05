import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";


export const authOptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "passsword" },
            },
            async authorize(credentials: Record<string, string> | undefined) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or passsword");
                }

                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("No user found with this");
                    }
                    console.log("UserData: ", { user })
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isValid) {
                        throw new Error("invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Auth error: ", error);
                    throw error;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                await connectToDatabase();

                // Check if user already exists
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account.provider || "google",
                    });
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {

                session.user.id = token.id as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        signOut: "/login", // 👈 add this
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};
