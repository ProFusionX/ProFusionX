"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("mentee"); // Changed to role
  const [skills, setSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [expertise, setExpertise] = useState("");
  const [companyAffiliation, setCompanyAffiliation] = useState("");
  const [mentoringInterests, setMentoringInterests] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const profileData =
      role === "mentee"
        ? { skills, experienceLevel, learningGoals }
        : { expertise, companyAffiliation, mentoringInterests };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          role, // Updated to role
          ...profileData,
        }),
      });

      if (response.ok) {
        router.push(`/dashboard/${role}`);
      } else {
        const data = await response.json();
        setError(data.error || "An error occurred during sign up");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              I want to be a:
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="role" // Updated to role
                  value="mentee"
                  checked={role === "mentee"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="ml-2">Mentee</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  className="form-radio"
                  name="role" // Updated to role
                  value="mentor"
                  checked={role === "mentor"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span className="ml-2">Mentor</span>
              </label>
            </div>
          </div>

          {role === "mentee" ? (
            <>
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Skills
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="experience-level"
                  className="block text-sm font-medium text-gray-700"
                >
                  Experience Level
                </label>
                <select
                  id="experience-level"
                  name="experienceLevel"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="">Select Experience Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="learning-goals"
                  className="block text-sm font-medium text-gray-700"
                >
                  Learning Goals
                </label>
                <textarea
                  id="learning-goals"
                  name="learningGoals"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your learning goals"
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                ></textarea>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="expertise"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expertise
                </label>
                <input
                  id="expertise"
                  name="expertise"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Expertise (comma separated)"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="company-affiliation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Affiliation
                </label>
                <input
                  id="company-affiliation"
                  name="companyAffiliation"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your company affiliation"
                  value={companyAffiliation}
                  onChange={(e) => setCompanyAffiliation(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="mentoring-interests"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mentoring Interests
                </label>
                <textarea
                  id="mentoring-interests"
                  name="mentoringInterests"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your mentoring interests"
                  value={mentoringInterests}
                  onChange={(e) => setMentoringInterests(e.target.value)}
                ></textarea>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
