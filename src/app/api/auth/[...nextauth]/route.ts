import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

console.log("🔥 DEBUG: NEXTAUTH_URL is currently:", process.env.NEXTAUTH_URL);
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
