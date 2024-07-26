import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Mentor-Mentee Platform
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {session?.user.role === "mentor" && (
                <Link
                  href="/dashboard/mentor"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Mentor Dashboard
                </Link>
              )}
              {session?.user.role === "mentee" && (
                <Link
                  href="/dashboard/mentee"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Mentee Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <>
                <span className="text-gray-700 mr-4">{session.user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
