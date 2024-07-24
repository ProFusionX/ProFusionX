"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TaskCard from "@/components/TaskCard";

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user.role !== "mentee") {
      router.push("/dashboard/mentor");
    } else {
      fetchTasks();
    }
  }, [session, status, router]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    if (data.success) {
      setTasks(data.data);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Mentee Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Available Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}
