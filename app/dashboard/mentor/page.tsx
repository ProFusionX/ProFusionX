"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TaskCard from "@/components/TaskCard";
import ProfileOverview from "@/components/ProfileOverview";
import TaskForm from "@/components/TaskFrom";

interface Task {
  _id: string;
  title: string;
  description: string;
  price: number;
  mentor: {
    name: string;
  };
}

export default function MentorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user.role !== "mentor") {
      router.push("/dashboard/mentee");
    } else {
      fetchTasks();
    }
  }, [session, status, router]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks/created");
    const data = await res.json();
    if (data.success) {
      setTasks(data.data);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    if (data.success) {
      fetchTasks();
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileOverview user={session?.user} />
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Create New Task</h2>
        <TaskForm onSubmit={handleCreateTask} />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}
