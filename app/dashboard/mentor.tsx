import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import TaskManagement from "@/components/TaskManagement";
import BountyListing from "@/components/BountyListing";

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const MentorDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session && (session.user as any).role !== "mentor") {
      router.push("/dashboard/mentee");
    } else {
      fetchProjects();
    }
  }, [session, status]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects?mentor=true");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mentor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
          <ul className="space-y-2">
            {projects.map((project) => (
              <li
                key={project._id}
                className={`p-2 rounded cursor-pointer ${
                  selectedProject === project._id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setSelectedProject(project._id)}
              >
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.status}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          {selectedProject && <TaskManagement projectId={selectedProject} />}
        </div>
      </div>
      <div className="mt-12">
        <BountyListing />
      </div>
    </div>
  );
};

export default MentorDashboard;
