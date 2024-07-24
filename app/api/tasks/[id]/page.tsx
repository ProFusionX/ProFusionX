'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Task {
  _id: string;
  title: string;
  description: string;
  price: number;
  mentor: {
    _id: string;
    name: string;
  };
  status: string;
  mentee?: {
    _id: string;
    name: string;
  };
}

export default function TaskDetail({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setTask(data.data);
      }
    };
    fetchTask();
  }, [params.id]);

  const handleApply = async () => {
    const res = await fetch(`/api/tasks/${params.id}/apply`, {
      method: 'POST',
    });
    const data = await res.json();
    if (data.success) {
      router.refresh();
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <p className="text-green-600 font-bold mb-4">ZAR {task.price.toFixed(2)}</p>
      <p className="mb-4">Mentor: {task.mentor.name}</p>
      <p className="mb-4">Status: {task.status}</p>
      {task.mentee && <p className="mb-4">Assigned to: {task.mentee.name}</p>}
      {session?.user.role === 'mentee' && task.status === 'open' && (
        <button
          onClick={handleApply}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Apply for Task
        </button>
      )}
    </div>
  );
}