import { apiHandler } from "@/lib/api-handler";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { use } from "react";


export const POST = apiHandler(async (request) => {
    const { email, password } = await request.json()
    if (!email || !password)
        return NextResponse.json({ error: "Email and Password are required" }, { status: 400 })

    await connectToDatabase();

    const existingUser = await User.findOne({ email })
    if (existingUser)
        return NextResponse.json({ error: "Email already registered in system" }, { status: 400 })

    const newUser = await User.create({
        username: email.split("@")[0],
        email,
        password 
    });
    
    return NextResponse.json({
        success: true,
        message: "User created successfully",
        data: newUser,
    });
})