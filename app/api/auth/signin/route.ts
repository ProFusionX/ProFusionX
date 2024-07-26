import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateToken(user._id.toString());

    return NextResponse.json({ success: true, token });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
