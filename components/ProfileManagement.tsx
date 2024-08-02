import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Profile {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  role: "mentor" | "mentee";
}

const ProfileManagement: React.FC = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: e.target.value.split(",").map((skill) => skill.trim()),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="bio" className="block mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="skills" className="block mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={profile.skills.join(", ")}
              onChange={handleSkillsChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Bio:</strong> {profile.bio}
          </p>
          <p>
            <strong>Skills:</strong> {profile.skills.join(", ")}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
