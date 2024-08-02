
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Bounty from "@/lib/models/Bounty";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bounty = await Bounty.findById(params.id).populate('mentor', 'name email');
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }
    return NextResponse.json(bounty);
  } catch (error) {
    console.error("Error fetching bounty:", error);
    return NextResponse.json({ error: "Error fetching bounty" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'mentor') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, amount, requiredSkills, status } = await request.json();

    const bounty = await Bounty.findById(params.id);
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    if (bounty.mentor.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized to update this bounty" }, { status: 403 });
    }

    bounty.title = title || bounty.title;
    bounty.description = description || bounty.description;
    bounty.amount = amount || bounty.amount;
    bounty.requiredSkills = requiredSkills || bounty.requiredSkills;
    bounty.status = status || bounty.status;
    bounty.updatedAt = new Date();

    await bounty.save();

    return NextResponse.json(bounty);
  } catch (error) {
    console.error("Error updating bounty:", error);
    return NextResponse.json({ error: "Error updating bounty" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'mentor') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const bounty = await Bounty.findById(params.id);
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }

    if (bounty.mentor.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized to delete this bounty" }, { status: 403 });
    }

    await Bounty.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Bounty deleted successfully" });
  } catch (error) {
    console.error("Error deleting bounty:", error);
    return NextResponse.json({ error: "Error deleting bounty" }, { status: 500 });
  }
}
