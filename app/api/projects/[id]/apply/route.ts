import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Project from "@/lib/models/Project";
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

    const project = await Project.findById(params.id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const existingApplication = project.applications.find(
      (app: { mentee: { toString: () => any } }) =>
        app.mentee.toString() === mentee._id.toString()
    );

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this project" },
        { status: 400 }
      );
    }

    project.applications.push({
      mentee: mentee._id,
      status: "pending",
      message,
    });

    await project.save();

    return NextResponse.json(
      { message: "Application submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error applying to project:", error);
    return NextResponse.json(
      { error: "Error applying to project" },
      { status: 500 }
    );
  }
}
