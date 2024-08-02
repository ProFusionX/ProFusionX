import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Project from "../../../lib/models/Project";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== "mentor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, category, requiredSkills, attachments } =
      await request.json();
    const mentor = await User.findOne({ email: session.user.email });

    const newProject = await Project.create({
      title,
      description,
      mentor: mentor._id,
      category,
      requiredSkills,
      attachments,
    });

    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const skill = searchParams.get("skill");

  try {
    let query = {};

    if (category) {
      query = { ...query, category };
    }

    if (skill) {
      query = { ...query, requiredSkills: skill };
    }

    const projects = await Project.find(query).populate("mentor", "name email");

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error fetching projects" },
      { status: 500 }
    );
  }
}
