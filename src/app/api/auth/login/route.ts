import { apiHandler } from "@/lib/api-handler";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const POST = apiHandler(async (request) => {
    const { email, password } = await request.json();

    // 1. Basic Validation
    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and Password are required" }, 
            { status: 400 }
        );
    }

    await connectToDatabase();

    // 2. Find User (explicitly select password if it's set to select: false in schema)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        // Generic error message for security (don't reveal if email exists)
        return NextResponse.json(
            { error: "Invalid email or password" }, 
            { status: 401 }
        );
    }

    // 3. Verify Password
    // Compare the provided plain password with the hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json(
            { error: "Invalid email or password" }, 
            { status: 401 }
        );
    }

    // 4. Generate JWT Token
    // Ensure JWT_SECRET is in your .env file
    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" } // Token valid for 7 days
    );

    // 5. Create Response
    const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
            _id: user._id,
            email: user.email,
            username: user.username
        }
    });

    // 6. Set Cookie (Optional but recommended for security)
    // This makes the token httpOnly so client-side JS can't steal it
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        path: "/",
    });

    return response;
});