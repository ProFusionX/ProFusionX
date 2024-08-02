import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  mentor: {
    name: string;
    email: string;
  };
}

const ProjectBoard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Project Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project._id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-600 mb-2">{project.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              Category: {project.category}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Skills: {project.requiredSkills.join(", ")}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Mentor: {project.mentor.name}
            </p>
            <Link href={`/projects/${project._id}`}>
              <a className="text-blue-500 hover:underline">View Details</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBoard;
