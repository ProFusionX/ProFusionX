import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  description: string;
  price: number;
  mentor: {
    name: string;
  };
}

interface TaskCardProps {
  task: Task;
  onApply?: () => void;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold">{task.title}</h2>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <p className="text-green-600 font-bold mt-4">
        ZAR {task.price.toFixed(2)}
      </p>
      <p className="text-gray-500 mt-2">Mentor: {task.mentor.name}</p>
      <Link
        href={`/tasks/${task._id}`}
        className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        View Details
      </Link>
    </div>
  );
}
