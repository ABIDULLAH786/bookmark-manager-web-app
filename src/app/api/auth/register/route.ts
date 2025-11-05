import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        if (!email || !password)
            return NextResponse.json({ error: "Email and Password are required" }, { status: 400 })

        await connectToDatabase();

        const existingUser = await User.findOne({ email })
        if (existingUser)
            return NextResponse.json({ error: "Email already registered in system" }, { status: 400 })

        await User.create({
            email, password
        });

        return NextResponse.json({ message: "User registered successfully" }, { status: 200 })

    } catch (error) {
        console.error("Registeration Error: ", { error })
        return NextResponse.json({ error: "Filed to register" }, { status: 500 })

    }
}