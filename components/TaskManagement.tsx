// components/TaskManagement.tsx

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "completed";
  assignedTo: {
    _id: string;
    name: string;
  };
  dueDate: string;
}

interface TaskManagementProps {
  projectId: string;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ projectId }) => {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, projectId }),
      });
      if (!response.ok) throw new Error("Failed to create task");
      fetchTasks();
      setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      {(session?.user as any)?.role === "mentor" && (
        <form onSubmit={handleCreateTask} className="mb-6">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="Assigned To (User ID)"
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask({ ...newTask, assignedTo: e.target.value })
            }
            className="border p-2 mr-2"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            className="border p-2 mr-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </form>
      )}
      <div className="grid grid-cols-4 gap-4">
        {["todo", "in-progress", "review", "completed"].map((status) => (
          <div key={status} className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2 capitalize">
              {status.replace("-", " ")}
            </h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-2 mb-2 rounded shadow"
                >
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm">Assigned to: {task.assignedTo.name}</p>
                  <p className="text-sm">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateTaskStatus(
                        task._id,
                        e.target.value as Task["status"]
                      )
                    }
                    className="mt-2 p-1 text-sm"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;
