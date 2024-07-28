import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (session && session.user) {
    const user = await User.findOne({ email: session.user.email });

    if (user) {
      return NextResponse.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }

  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}
