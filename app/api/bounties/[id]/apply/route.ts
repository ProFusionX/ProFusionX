import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Bounty from "@/lib/models/Bounty";
import User from "@/lib/models/User";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "mentee") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await request.json();
    const mentee = await User.findOne({ email: session.user.email });

    const bounty = await Bounty.findById(params.id);
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    const existingApplication: any = bounty.applications.find(
      (app: any) => app.mentee.toString() === mentee._id.toString()
    );

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this bounty" },
        { status: 400 }
      );
    }

    bounty.applications.push({
      mentee: mentee._id,
      status: "pending",
      message,
    });

    await bounty.save();

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error applying to bounty:", error);
    return NextResponse.json(
      { error: "Error applying to bounty" },
      { status: 500 }
    );
  }
}
