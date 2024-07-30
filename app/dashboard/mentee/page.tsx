"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskFrom";
import TaskCard from "@/components/TaskCard";
import ProfileOverview from "@/components/ProfileOverview"; //TODO

interface Task {
  _id: string;
  title: string;
  description: string;
  price: number;
  mentor: {
    name: string;
  };
}

export default function MenteeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskAssignments, setTaskAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user.role !== "mentee") {
      router.push("/dashboard/mentor");
    } else {
      fetchTasks();
      fetchTaskAssignments();
    }
  }, [session, status, router]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    if (data.success) {
      setTasks(data.data);
    }
  };

  const fetchTaskAssignments = async () => {
    const res = await fetch("/api/task-assignments");
    const data = await res.json();
    if (data.success) {
      setTaskAssignments(data.data);
    }
  };

  const handleApplyForTask = async (taskId: string) => {
    const res = await fetch("/api/task-assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    });
    const data = await res.json();
    if (data.success) {
      fetchTaskAssignments();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-2 lg:col-span-3">
          <h2 className="text-2xl font-semibold mb-4">Available Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onApply={() => handleApplyForTask(task._id)}
              />
            ))}
          </div>
        </div>
        <TaskForm onSubmit={(taskData) => handleCreateTask(taskData)} />
      </div>
    </div>
  );
}
