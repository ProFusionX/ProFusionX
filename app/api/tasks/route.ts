import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Task from "@/lib/models/Task";
import Project from "@/lib/models/Project";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let query = {};
    if (projectId) {
      query = { project: projectId };
    }

    const tasks = await Task.find(query).populate("assignedTo", "name email");
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Error fetching tasks" },
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
    const { projectId, title, description, assignedTo, dueDate } =
      await request.json();

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.mentor.toString() !== (session.user as any).id) {
      return NextResponse.json(
        { error: "Unauthorized to create tasks for this project" },
        { status: 403 }
      );
    }

    const newTask = new Task({
      project: projectId,
      title,
      description,
      assignedTo,
      dueDate,
    });

    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}