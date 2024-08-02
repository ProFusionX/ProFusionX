import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Bounty from "@/lib/models/Bounty";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bounties = await Bounty.find().populate("mentor", "name email");
    return NextResponse.json(bounties);
  } catch (error) {
    console.error("Error fetching bounties:", error);
    return NextResponse.json(
      { error: "Error fetching bounties" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "mentor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, amount, requiredSkills } = await request.json();

    const newBounty = new Bounty({
      title,
      description,
      mentor: (session.user as any).id,
      amount,
      requiredSkills,
    });

    await newBounty.save();

    return NextResponse.json(newBounty, { status: 201 });
  } catch (error) {
    console.error("Error creating bounty:", error);
    return NextResponse.json(
      { error: "Error creating bounty" },
      { status: 500 }
    );
  }
}
