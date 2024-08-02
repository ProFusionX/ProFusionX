import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  mentor: {
    _id: any;
    name: string;
    email: string;
  };
  status: string;
  applications: Array<{
    mentee: {
      _id: string;
      name: string;
    };
    status: string;
    message: string;
  }>;
}

export default function ProjectDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Failed to fetch project");
      const data = await res.json();
      setProject(data);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  const handleApply = async () => {
    try {
      const res = await fetch(`/api/projects/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: applicationMessage }),
      });
      if (!res.ok) throw new Error("Failed to apply");
      await fetchProject(); // Refresh project data
      setApplicationMessage("");
    } catch (error) {
      console.error("Error applying to project:", error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Project Details</h2>
        <p>
          <strong>Category:</strong> {project.category}
        </p>
        <p>
          <strong>Required Skills:</strong> {project.requiredSkills.join(", ")}
        </p>
        <p>
          <strong>Status:</strong> {project.status}
        </p>
        <p>
          <strong>Mentor:</strong> {project.mentor.name}
        </p>
      </div>
      {session &&
        (session.user as any).role === "mentee" &&
        project.status === "open" && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Apply for this Project
            </h2>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              placeholder="Why are you interested in this project?"
            ></textarea>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleApply}
            >
              Submit Application
            </button>
          </div>
        )}
      {session &&
        (session.user as any).role === "mentor" &&
        (session.user as any).id === project.mentor._id && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Applications</h2>
            {project.applications.map((app) => (
              <div key={app.mentee._id} className="border p-4 mb-2 rounded">
                <p>
                  <strong>Mentee:</strong> {app.mentee.name}
                </p>
                <p>
                  <strong>Status:</strong> {app.status}
                </p>
                <p>
                  <strong>Message:</strong> {app.message}
                </p>
                {app.status === "pending" && (
                  <div className="mt-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                      Accept
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
