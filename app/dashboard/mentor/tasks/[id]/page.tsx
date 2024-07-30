"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description: string;
  price: number;
  mentee: {
    _id: string;
    name: string;
  };
  status: string;
}

export default function MentorTask({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setTask(data.data);
      }
      setLoading(false);
    };
    fetchTask();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;

  if (!task) return <div>Task not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <p className="text-green-600 font-bold mb-4">
        ZAR {task.price.toFixed(2)}
      </p>
      <p className="mb-4">Mentee: {task.mentee.name}</p>
      <p className="mb-4">Status: {task.status}</p>
      {session?.user.role === "mentor" && (
        <button
          onClick={() =>
            router.push(`/dashboard/mentor/tasks/${params.id}/edit`)
          }
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit Task
        </button>
      )}
    </div>
  );
}
