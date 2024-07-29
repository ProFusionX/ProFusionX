"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CardList from "../components/Card"; // Update the import path

const headings = [
  "Empowering Mentorship, One Task at a Time",
  "Delegate with Confidence to Mentees Who Share Your Vision",
  "Unlock Your Potential with Guided Learning",
];

export default function Home() {
  const [currentHeading, setCurrentHeading] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentHeading((prevHeading) => (prevHeading + 1) % headings.length);
    }, 3000); // Change heading every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-300 via-gray-100 to-green-300 text-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <div className="h-20 mb-8">
          {" "}
          {/* Fixed height container for headings */}
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            {headings[currentHeading]}
          </h1>
        </div>
        <p className="text-lg mb-12 leading-relaxed description">
          Research shows that a lack of practical experience hinders junior
          professionals employability. Meanwhile, seniors are overwhelmed with
          tasks, unable to delegate to skilled subordinates. Our platform
          bridges this gap, connecting mentors and mentees to foster growth,
          skill-sharing, and meaningful collaboration. Join us in
          revolutionizing the way we learn and work.
        </p>
        <div className="flex gap-6 justify-center mb-12">
          <Link
            href="/auth/signin"
            className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-400 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Sign Up
          </Link>
        </div>
        <CardList />
      </div>
    </main>
  );
}
