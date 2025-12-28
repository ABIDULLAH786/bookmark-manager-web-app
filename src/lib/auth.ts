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
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await connectToDatabase();
                // ⚠️ IMPORTANT: We must select the password field if it's hidden by default in your schema
                const user = await User.findOne({ email: credentials.email }).select("+password");
                console.log("Logged in user: ", user)
                if (!user) {
                    throw new Error("No user found");
                }
                
                let isValidPassword = false;

                isValidPassword = await bcrypt.compare(credentials.password, user.password);

                if (!isValidPassword) {
                    throw new Error("Invalid password...");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user?.name, // optional
                    image: user?.image, // optional
                };
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
            console.log("JWT Callback: ", { token, user })
            if (user) {
                token._id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {

                session.user.id = token._id as string;
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
